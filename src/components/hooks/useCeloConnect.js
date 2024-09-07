import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useSwitchChain } from "wagmi";
import { ethers } from "ethers";
import {MundoAbi, MundoContractAddress, USDC_ABI, USDC_CA} from "../utils/constants"

console.log({MundoAbi, MundoContractAddress, USDC_ABI, USDC_CA})
export default function useCeloConnect() {
	const { isConnected, chainId } = useAccount();
	const { openConnectModal } = useConnectModal();
	const [mundoContract, setMundoContract] = useState(null);
	const [USDCContract, setUSDCContract] = useState(null);
	const { switchChain } = useSwitchChain();

	// console.log(chain.id)
	// console.log(chainId)

	const checkConnection = useCallback(async () => {
		if (!isConnected) {
			toast.error("Please connect your wallet.");
			openConnectModal?.();
			return false;
		}
		if (chainId !== 44787 && chainId !== 42220) {
			// toast.error("Please connect to right network");
			switchChain({ chainId: 44787 });
			return false;
		}
		return true;
	}, [isConnected, openConnectModal]);

	useEffect(() => {
		const getSignerProvider = async () => {
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(
				MundoContractAddress,
				MundoAbi,
				signer
			);
			const USDCcontract = new ethers.Contract(USDC_CA, USDC_ABI, signer);
			// console.log(contract)
			// setSigner(signer);
			// setProvider(provider);
			setMundoContract(contract);
			setUSDCContract(USDCcontract);
		};
		getSignerProvider();

		// return { signer, provider, contract };
	}, []);

	// };
	// console.log({ signer, provider, contract });
	// const {signer, provider, contract} = await getSignerProvider();
	return { checkConnection, mundoContract, USDCContract };
}
