import Product from "@/components/products/Product";
import { HeroCard } from "@/components/ui/Card/HeroCard";
import FeaturedCollection from "@/components/FeaturedCollection";
import React, { useEffect, useState } from "react";
import NewArrival from "@/components/NewArrival";
import useCeloConnect from "@/components/hooks/useCeloConnect";
import { ethers } from "ethers";
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
	const [loading, setLoading] = useState(false);
	const { checkConnection, mundoContract } = useCeloConnect();

	useEffect(() => {
		const getAllItems = async () => {
			if (!mundoContract) return;
			const tx = await mundoContract.getAllItems();
      console.log(tx)

			const res = tx.map((t: any) => {
				return {
					id: Number(t[0]),
					name: t[1],
					category: t[2],
					image: t[3],
					price: ethers.formatUnits(t[4], 6),
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
