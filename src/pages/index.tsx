import FeaturedCollection from "@/components/FeaturedCollection";
import React, { useEffect, useState } from "react";
import NewArrival from "@/components/NewArrival";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import useCeloConnect from "@/hooks/useCeloConnect";
import { HeroCard } from "@/components/HeroCard";
export interface ProductType {
	id: number;
	name: string;
	category: string;
	image: string;
	price: string;
	rating: number;
	stock: number;
	description: string;
}

export default function Home() {
	const [products, setProducts] = useState<ProductType[]>([]);
	const { checkConnection, mundoContract  } = useCeloConnect();
	const { chainId } = useAccount();


	useEffect(() => {
			let decimal: number;
			if (chainId === 44787) {
				decimal = 6;
			} else if (chainId === 42220) {
				decimal = 18;
			}
		const getAllItems = async () => {
			if (!mundoContract ) return;
			const tx = await mundoContract.getAllMarketPlaceItems();

			const res = tx.map((t: any) => {
				return {
					id: Number(t[0]),
					name: t[1],
					category: t[2],
					image: t[3],
					price: ethers.formatUnits(t[4], decimal),
					rating: Number(t[5]),
					stock: Number(t[6]),
					description: t[7],
				};
			});

			setProducts(res);
		};
		getAllItems();
	}, [mundoContract]);
	return (
		<div className="p-6 flex flex-col gap-6">
			<HeroCard />
			<FeaturedCollection products={products} />
			<NewArrival products={products} />
		</div>
	);
}
