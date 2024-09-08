"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductType } from "..";
// import useCeloConnect from "@/components/hooks/useCeloConnect";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import useCeloConnect from "@/hooks/useCeloConnect";
const item = () => {
	const {
		checkConnection,
		mundoContract,
		tokenContract,
		mundoSelectedAddress,
		tokenSelectedAddress,
		currency
	} = useCeloConnect();
	const [product, setProduct] = useState<ProductType>({
		id: 0,
		name: "",
		category: "",
		image: "",
		price: "",
		rating: 0,
		stock: 0,
		description: "",
	});
	const { chainId } = useAccount();

	const router = useRouter();
	// const { id } = router.query;
	const params = useParams<{ tag: string; id: string }>();
	const id = params?.id;
	// console.log(id);

	useEffect(() => {
		const getProduct = async () => {
			let decimal: number=18;
			if (chainId === 44787) {
				decimal = 6;
			} else if (chainId === 42220) {
				decimal = 18;
			}
			const connect = await checkConnection();
			if (!connect) return;
			if (!mundoContract || !id ) return;
			const tx = await mundoContract.getItem(id);

			const item: ProductType = {
				id: Number(tx[0]),
				name: tx[1],
				category: tx[2],
				image: tx[3],
				price: ethers.formatUnits(tx[4], decimal),
				rating: Number(tx[5]),
				stock: Number(tx[6]),
				description: tx[7],
			};
			setProduct(item);
		};
		getProduct();
	}, [mundoContract, id, chainId]);

	const handleBuy = async () => {
		let decimal: number =18;
		if (chainId === 44787) {
			decimal = 6;
		} else if (chainId === 42220) {
			decimal = 18;
		}
		const connect = await checkConnection();
		if (!connect) return;
		if (!mundoContract || !tokenContract) return;
		try {
			toast.loading("Approving, please wait...");
			console.log(product.price);
			checkConnection();
			const price = ethers.parseUnits(product.price, decimal);

			const approveTx = await tokenContract.approve(
				mundoSelectedAddress,
				price
			);
			await approveTx.wait();
			toast.dismiss();
			toast.loading("Purchasing");
			const buyTx = await mundoContract.buy(id, tokenSelectedAddress);
			toast.dismiss();
			toast.loading("Waiting for confirmation");
			await buyTx.wait();
			toast.dismiss();
			toast.success("Purchase successful");
			router.refresh();
		} catch (error) {
			console.log(error);
			toast.dismiss();
			toast.error("Failed to purchase item");
		}
	};

	// console.log(params)

	return (
		<div className="mt-[52px] p-3 md:p-6">
			<h4 className="pl-[74px] font-Manrope  mb-[53px] text-[22px] leading-[28px] font-bold text-[#FFFFFF]">
				Product
			</h4>
			<div className="flex items-center pl-[40px] mb-[20px]">
				<img
					src={product.image}
					alt="Cryptovoxels"
					className="w-[580px] h-[301px] mr-[103px]"
				/>

				<div className="flex flex-col space-y-2">
					<p className="text-[#FFFFFF] font-Manrope text-[48px] leading-[65.57px]  font-medium mb-[91px]">
						{product.name}
					</p>
					<p className="text-[gray] text-sm mt-3">
						Left in stock: {product.stock}
					</p>

					<p className="text-xl">Price: {Number(product.price).toFixed(2)} {currency}</p>
					<button
						onClick={handleBuy}
						className="w-[417px] text-[14px] leading-[21px] font-manrope font-bold mr-[61px] px-[16px] py-[8px] bg-[#1A5CE5] text-[#FFFFFF] rounded"
					>
						Buy
					</button>
				</div>
			</div>

			<div className="">
				<h4 className="pt-[15px] font-bold text-xl w-[902px] h-[28px] mb-5">
					Description
				</h4>
				<p className="">{product.description}</p>
			</div>
		</div>
	);
};

export default item;
