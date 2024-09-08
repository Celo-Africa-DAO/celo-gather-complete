import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useSwitchChain } from "wagmi";
import { ethers, Contract } from "ethers";
import {
	MUNDO_ABI,
	MUNDO_MAINNET_CA,
	MUNDO_TESTNET_CA,
	ERC20_ABI,
	USDC_CA,
	CKES_CA,
} from "../utils/constants";

type Currency = "USDC" | "cKES" | null;

export default function useCeloConnect() {
	// Typing for wagmi hooks
	const { isConnected, chainId } = useAccount();
	const { openConnectModal } = useConnectModal();
	const { switchChain } = useSwitchChain();

	// Typing state variables
	const [mundoContract, setMundoContract] = useState<Contract | null>(null);
	const [mundoSelectedAddress, setMundoSelectedAddress] = useState<string | null>(null);
	const [tokenSelectedAddress, setTokenSelectedAddress] = useState<string | null>(null);
	const [tokenContract, setTokenContract] = useState<Contract | null>(null);
	const [currency, setCurrency] = useState<Currency>(null);

	// Typing for checkConnection function
	const checkConnection = useCallback(async (): Promise<boolean> => {
		if (!isConnected) {
			toast.error("Please connect your wallet.");
			openConnectModal?.();
			return false;
		}
		if (chainId !== 44787 && chainId !== 42220) {
			// Switch to Celo Alfajores testnet (44787)
			switchChain({ chainId: 44787 });
			return false;
		}
		return true;
	}, [isConnected, openConnectModal, switchChain, chainId]);

	// useEffect to handle contract and signer setup
	useEffect(() => {
		const getSignerProvider = async () => {
			let contract: Contract | null = null;
			let tokenContract: Contract | null = null;
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();

			if (chainId === 44787) {
				contract = new ethers.Contract(MUNDO_TESTNET_CA, MUNDO_ABI, signer);
				tokenContract = new ethers.Contract(USDC_CA, ERC20_ABI, signer);
				setMundoSelectedAddress(MUNDO_TESTNET_CA);
				setTokenSelectedAddress(USDC_CA);
				setCurrency("USDC");
			} else if (chainId === 42220) {
				contract = new ethers.Contract(MUNDO_MAINNET_CA, MUNDO_ABI, signer);
				tokenContract = new ethers.Contract(CKES_CA, ERC20_ABI, signer);
				setMundoSelectedAddress(MUNDO_MAINNET_CA);
				setTokenSelectedAddress(CKES_CA);
				setCurrency("cKES");
			}

			setMundoContract(contract);
			setTokenContract(tokenContract);
		};

		if (chainId) {
			getSignerProvider();
		}
	}, [chainId]);

	// Return the state and utility functions
	return {
		checkConnection,
		mundoContract,
		tokenContract,
		mundoSelectedAddress,
		tokenSelectedAddress,
		currency,
	};
}
