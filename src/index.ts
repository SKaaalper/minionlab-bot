import chalk from "chalk";
import readline from "readline";
import { AccountManager } from "./classes/AccountManager";
import { ProxyManager } from "./classes/ProxyManager";
import { WebSocketManager } from "./classes/WebSocketManager";

class AirdropBot {
  private accountManager: AccountManager;
  private proxyManager: ProxyManager;
  private webSocketManager: WebSocketManager;

  constructor() {
    this.accountManager = new AccountManager();
    this.proxyManager = new ProxyManager();
    this.webSocketManager = new WebSocketManager(
      this.accountManager,
      this.proxyManager
    );
  }

  async initialize(): Promise<void> {
    this.displayHeader();
    this.accountManager.loadAccounts();
    this.proxyManager.loadProxies();

    const useProxy = await this.promptUseProxy();
    if (useProxy && this.proxyManager.proxies.length < this.accountManager.accounts.length) {
      console.error(
        "Not enough proxies for the number of accounts. Please add more proxies."
      );
      process.exit(1);
    }

    this.webSocketManager.initialize(useProxy);
  }

  private displayHeader(): void {
    console.clear();
    console.log(
      chalk.green(` ____  _                                 _    ___ 
 / ___|| |_ _ __ ___  __ _ _ __ ___      / \\  |_ _|
 \\___ \\| __| '__/ _ \\/ _\` | '_ \` _ \\    / _ \\  | | 
  ___) | |_| | |  __/ (_| | | | | | |  / ___ \\ | | 
 |____/ \\__|_|  \\___|\\__,_|_| |_| |_| /_/   \\_\\___|`)
    );
    console.log(chalk.green("          El Puqus Airdrop Bot                  "));
    console.log(chalk.green("          github.com/ahlulmukh                  "));
  }

  private async promptUseProxy(): Promise<boolean> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Do you want to use a proxy? (y/n): ", (answer: string) => {
        rl.close();
        resolve(answer.toLowerCase() === "y");
      });
    });
  }
}

const bot = new AirdropBot();
bot.initialize();