import { soap, Client } from 'strong-soap';

export default class {
  private url: String;
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

  getMethods = async () => (await this.client).describe()

  call = async (method: string, options: any) => (await this.client)[method](options)
}
