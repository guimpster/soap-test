import { soap, Client, Server } from 'strong-soap';
import * as fs from 'fs';
import * as http from 'http';

export class SoapClient {
  private url: string;
  private options: any;
  private client: Promise<typeof Client>;

  constructor({ url, ...options }) {
    this.url = url;
    this.options = options;
    this.client = new Promise((resolve, reject) => {
      soap.createClient(this.url, this.options, (err, client) => {
        if (err) {
          console.error(err);
          reject(err);
          process.exit(1);
        }

        if (!client) {
          console.error('Could not instantiate client');
          reject(err);
          process.exit(1);
        }

        resolve(client);
      });
    });
  }

  getMethods = async () => (await this.client).describe();

  call = async (method: string, options: any) =>
    (await this.client)[method](options);
}

export class SoapServer {
  private server: typeof Server;
  private xml: string;
  private services: any;
  private port: number;

  constructor({ services, wsdlFile, port = 8000 }) {
    this.services = services;
    this.xml = fs.readFileSync(wsdlFile, 'utf8');
    this.port = port;

    const exitHandler = () => {
      if (this.server) {
        this.server.close(() => {
          console.log('Server closed!');
        });
      }
    };

    // do something when app is closing
    process.on('exit', exitHandler.bind(this, { cleanup: true }));

    // catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(this, { exit: true }));

    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(this, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(this, { exit: true }));

    // catches uncaught exceptions
    // process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
  }

  start = async () => {
    if (this.server) {
      return;
    }

    this.server = http.createServer((request, response) => {
      response.end('404: Not Found: ' + request.url);
    });

    return new Promise((resolve, reject) => { 

      soap.listen(this.server, '/wsdl', this.services, this.xml);
      this.server.listen(this.port, null, null, (error) => {
        console.log('Data: ', {
          server: this.server,
          services: this.services,
          port: this.port,
          xml: this.xml
        })
        if (error) {
          console.error('Unable to listen on port', this.port, error);
          reject(error);
          process.exit(1);
        }

        console.log(`🚀  Server ready at http://localhost:${this.port}/wsdl`);
        resolve();
      });
    });
  };
}
