"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";
import useCeloConnect from "../../hooks/useCeloConnect";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

interface LayoutProps {
	children: ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
	const { checkConnection, mundoContract, currency, tokenSelectedAddress } =
		useCeloConnect();
	const { chain, chainId, address, isConnected } = useAccount();
	const [isTokenAddressSet, setIsTokenAddressSet] = useState(false);
	const [isFetching, setIsFetching] = useState(true);
	const [tokenAddress, setTokenAddress] = useState("");
	const [openModal, setOpenModal] = useState(false);
	const router = useRouter();

	const handleSetToken = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			toast.loading("Adding token address");
			if (!ethers.isAddress(tokenAddress)) {
				toast.error("Invalid token address");
				return;
			}
      if(!mundoContract) return;
			const tx = await mundoContract.addToken(tokenAddress);
			await tx.wait();

			console.log(tx);

			toast.dismiss();
			toast.success("Token address added successfully");
			setOpenModal(false);
			router.refresh();
		} catch (error) {
			console.log(error);
			toast.dismiss();
			toast.error("Failed to add token address");
		}
	};

	useEffect(() => {
		const checkContractAddress = async () => {
			try {
				const connect = await checkConnection();
				if (!connect || !mundoContract) return;
				const owner = await mundoContract?.owner();

				const isTokenAllowed = await mundoContract.checkAllowedTokens(tokenSelectedAddress);
				if (owner === address && !isTokenAllowed) {
					setOpenModal(true);
				}
				console.log(isTokenAllowed);
				setIsTokenAddressSet(isTokenAllowed);
			} catch (error) {
				toast.error("Failed to check token address");
			} finally {
				setIsFetching(false);
			}
		};
		checkContractAddress();
	}, [mundoContract, chainId]);

	return (
		<div className=" flex flex-col min-h-screen text-white bg-black">
			<Header />
			{!isFetching && isConnected && !isTokenAddressSet && (
				<AlertDialog open={openModal} onOpenChange={setOpenModal}>
					<AlertDialogContent className="bg-black text-white">
						<AlertDialogHeader>
							<AlertDialogTitle>
								Set Token Address For Payments
							</AlertDialogTitle>
							<AlertDialogDescription>
								Fill the form below to set token address for Mundo on{" "}
								{chain?.name}
							</AlertDialogDescription>
							<form onSubmit={handleSetToken} className="space-y-4 ">
								<div className="grid w-full text-white mt-4 space-y-1 items-center gap-1.5">
									<Label className="text-white" htmlFor="name">
										Token address for {currency}
									</Label>
									<Input
										type="text"
										id="tokenAddress"
										placeholder="0x0000000000000000000000000000000"
										value={tokenAddress}
										className="text-white"
										required
										onChange={(e) => setTokenAddress(e.target.value)}
									/>
								</div>

								<Button
									type="submit"
									className="bg-green-800 float-end hover:bg-green-700"
								>
									Set token address
								</Button>
								{/* </AlertDialogFooter> */}
							</form>
						</AlertDialogHeader>
					</AlertDialogContent>
				</AlertDialog>
			)}
			<main className="flex-grow">{children}</main>
			<div className="mt-auto">
				<Footer />
			</div>
		</div>
	);
};

export default RootLayout;
