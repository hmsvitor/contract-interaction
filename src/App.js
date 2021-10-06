import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";

import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const greeterAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const tokenAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

function App() {
  console.log(process.env.ACCOUNT_PKEY);
  const [greeting, setGreetingValue] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [amount, setAmount] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getBalance() {
    if (typeof window.ethereum !== undefined) {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function fetchGreeting() {
    console.log(Greeter.abi);
    console.log("FetchGreeting executado");
    if (typeof window.ethereum !== "undefined") {
      console.log("Cai no if");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
        console.log("prodiver: ", provider);
        console.log("contract: ", contract);
      }
    } else {
      console.log("cai no E:LSE");
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>

        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
          value={greeting}
        />

        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input
          type="text"
          placeholder="Account ID"
          onChange={(e) => setUserAccount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />
      </header>
    </div>
  );
}

export default App;
