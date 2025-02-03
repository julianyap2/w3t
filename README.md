# 🚦 W3T dApp (Motoko + Next.js)

### Empowering Citizens to Enforce Traffic Laws in Indonesia  

Traffic law enforcement relies on **evidence**, but when implementation falls short, violations go unchecked. While **ETLE (Electronic Traffic Law Enforcement)** is available in certain areas of Indonesia, many areas remain uncovered, leading to unsafe road conditions.  

**W3T** is a decentralized application (**dApp**) built on the **Internet Computer (ICP)** to bridge this gap. It enables users to **report traffic law violations with video evidence** and earn **W3T tokens** if their report is validated as **guilty** by the police. Developed with **Motoko** for the backend and **Next.js** for the frontend, W3T ensures a **transparent, secure, and trustless** reporting system.  

---

## ⚡ How It Works  

### 1️⃣ Submit a Report 📤  
- Users (**Reporters**) record and upload a video of a traffic violation.  
- To prevent spam and false reports, **a certain amount of W3T tokens must be staked** before submitting a report.  

### 2️⃣ Police Review & Validation 👮‍♂️  
- The **police department** reviews the submitted video.  
- If the report is **validated as guilty**, the reporter **earns W3T tokens** after the offender pays the fine.  
- If the report is **invalid**, the staked tokens are **transferred to the police department** as a deterrent against spam submissions.  

### 3️⃣ Citizen Contribution 💪  
- By offering token-based incentives, **W3T encourages citizens to actively contribute to law enforcement**, making Indonesian roads safer.  

### 4️⃣ Trustless & Transparent 🔍  
- The **entire process is executed on Internet Computer Canisters**, including **video storage**, ensuring **immutability and transparency**.  

---

## 💰 Revenue Model & Canister Maintenance  

To sustain long-term operations, a **small percentage of the reporter’s reward** is allocated to maintain the **three core canisters**:  

✅ **Token Canister** – Handles W3T transactions  
✅ **Backend Canister** – Manages reports and verification logic  
✅ **Frontend Canister** – Powers the user interface  

This ensures a **self-sustaining cycle** of community participation and law enforcement validation.  

---

## 🛠 Try It Yourself  

We have deployed our **canisters on the main IC network**. Feel free to explore our dApp:  

🔹 **Frontend:** Please run `dfx deploy frontend --playground` and use the link printed on terminal
🔹 **Backend (Candid UI):** [View Here](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=vl2t7-5aaaa-aaaag-at3bq-cai)  
🔹 **W3T Token (Candid UI):** [View Here](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=vm3vl-qyaaa-aaaag-at3ba-cai)  

### 🏛 Police Role Access  
If you are a **judge** testing the system, email us your **Principal ID** at 📩 **samuelmaynard13@gmail.com**, and we will grant you police-level access.  

### 🪙 Add W3T Token to Your Wallet  
1. Add a **custom token** in your wallet.
2. Enter our **Token Canister ID:** vm3vl-qyaaa-aaaag-at3ba-cai
3. Select **ICRC-2** as the standard.
4. Need test tokens? Email us at 📩 samuelmaynard13@gmail.com, and we’ll mint some for you.

---

## 🚀 Future Development

### 1️⃣ Multi-Wallet Compatibility
- We currently only supports "Plug-Wallet" extension. Future plans include Bitfinity, ICPSwap, and Internet Identity.

### 2️⃣ DEX Listing for W3T Token
- Ensuring W3T is searchable and tradable on ICPSwap without manual token additions.

### 3️⃣ Better Video Uploading Mechanism
- Currently, ICP restrict data parameter to be max 2MB (when we tested it, we could only send max 0.2MB / request). Therefore, we implement a work-around for this limitation by dividing the chosen video into chunks of Blob with each chunk sized 0.2MB, then upload it one-by-one to the canister. This could take a long time to upload and we're planning to improve this method in the future.

### 4️⃣ AI-Powered Video Verification
- Prevents fake evidence (AI-generated videos) and reduces police workload.

### 5️⃣ Code Optimization & Security Audit
- Refactoring for better efficiency and aiming for a CertiK audit (71+ Fair score).

---

## 🏃 Run Locally  

To run the W3T dApp on your local machine, ensure you have the following installed:  
- **npm** (for frontend dependencies)  
- **dfx** & **dfxvm** (for managing Internet Computer canisters)  
- **mops** (for managing Motoko packages)  

### 1️⃣ Install Dependencies  
```sh
npm install
mops install
```

### 2️⃣ Start the Local DFX Network
```sh
dfx start --background
```
> ⚠️ Note: Running the dApp locally will not allow backend testing since we restrict anonymous users. We strongly recommend testing on our deployed canister in the IC mainnet or using the playground mode with the --playground flag.

### 3️⃣ Create Canisters
```sh
dfx canister create --all
dfx generate w3t
```

### 4️⃣ Deploy the W3T Token Canister
```sh
dfx deploy w3t_token
```
> 📌 Important: The W3T Token Canister ID is required for the next step. Copy it!

### 5️⃣ Deploy the W3T Backend Canister
```sh
dfx deploy w3t
```
> 📌 Don't forget: Paste the W3T Token Canister ID when prompted!

### 6️⃣ Update Environment Variables
```plaintext
NEXT_PUBLIC_W3T_CANISTER_ID=<your_deployed_w3t_canister_id>
```

### 7️⃣ Deploy the Frontend
```sh
dfx deploy frontend
```

---

#### 🚀 Your local instance is now ready! Open the frontend URL provided by dfx and explore.
> 💡 Pro Tip: For full functionality, we highly recommend testing on the IC mainnet. If you need test tokens or police role access, feel free to contact us at samuelmaynard13@gmail.com.

---

### 🌍 Join us in revolutionizing traffic law enforcement in Indonesia! 🚦
