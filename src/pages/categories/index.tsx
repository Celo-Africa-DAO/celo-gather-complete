// import useCeloConnect from "@/components/hooks/useCeloConnect";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { ProductType } from "..";
import useCeloConnect from "@/hooks/useCeloConnect";

const Categories = () => {
	const { checkConnection, mundoContract, currency } = useCeloConnect();
	const [electronicsCat, setElectronicsCat] = useState<ProductType[]>([]);
	const [clothingsCat, setClothingsCat] = useState<ProductType[]>([]);
	const [petsCat, setPetsCat] = useState<ProductType[]>([]);
	const { chainId } = useAccount();
	

	useEffect(() => {
		let decimal: number;
		if (chainId === 44787) {
			decimal = 6;
		} else if (chainId === 42220) {
			decimal = 18;
		}
        if(!mundoContract) return;
		const getAllItems = async () => {
			const items = await mundoContract.getAllMarketPlaceItems();

			const res = items.map((item: any) => {
				return {
					id: Number(item[0]),
					name: item[1],
					category: item[2],
					image: item[3],
					price: ethers.formatUnits(item[4], decimal),
					rating: Number(item[5]),
					stock: Number(item[6]),
					description: item[7],
				};
			});

			const filteredElect = res.filter(
				(item: ProductType) => item.category === "electronics"
			);
			const filteredClothing = res.filter(
				(item: ProductType) => item.category === "clothing"
			);
			const filteredPets = res.filter((item: any) => item.category === "pets");
			setElectronicsCat(filteredElect);
			setClothingsCat(filteredClothing);
			setPetsCat(filteredPets);
		};
		mundoContract && getAllItems();
	}, [mundoContract, chainId]);
	// const a = [
	// 	{
	// 		id: 1,
	// 		title: "Featured NFTs",
	// 		img: "/img/art.png",
	// 		text: "Digital Art",
	// 		description: "12,000 items",
	// 	},
	// 	{
	// 		id: 2,
	// 		img: "/img/collectibles.png",
	// 		text: "Collectibles",
	// 		description: "20,000 items",
	// 	},
	// 	{
	// 		id: 3,
	// 		img: "/img/Depth.png",
	// 		text: "Virtual Real Estate",
	// 		description: "30,000 items",
	// 	},
	// ];

	// const b = [
	// 	{
	// 		id: 4,
	// 		title: "Digital Arts",
	// 		img: "/img/Abstract.png",
	// 		text: "Abstract Art",
	// 		description: "100 items",
	// 	},
	// 	{
	// 		id: 5,
	// 		img: "/img/pop.png",
	// 		text: "Pop Art",
	// 		description: "200 items",
	// 	},
	// 	{
	// 		id: 6,
	// 		img: "/img/Surreal-art.png",
	// 		text: "Surreal Art",
	// 		description: "300 items",
	// 	},
	// ];

	// const c = [
	// 	{
	// 		id: 7,
	// 		title: "Virtual Real Estate",
	// 		img: "/img/metaverse.png",
	// 		text: "Metaverse City",
	// 		description: "1000 items",
	// 	},
	// 	{
	// 		id: 8,
	// 		img: "/img/decentraland.png",
	// 		text: "Decentraland",
	// 		description: "2000 items",
	// 	},
	// 	{
	// 		id: 9,
	// 		img: "/img/crytovoxels.png",
	// 		text: "Cryptovoxels",
	// 		description: "3000 items",
	// 	},
	// ];

	return (
		<div className="space-y-7">
			<div className="px-4 md:px-8 lg:px-[160px] my-4">
				<h3 className="text-[#9EA6B8] text-[16px] font-medium my-[36px]">
					Categories / Products
				</h3>
			</div>

			{electronicsCat?.length > 0 && (
				<div className="px-4 md:px-8 lg:px-[160px]">
					<h2 className="text-3xl text-[#FFFFFF] font-semibold my-5">
						Electronics
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4">
						{electronicsCat.map((item) => (
							<>
								<div key={item.id} className="">
									<Link
										href={`/item/${item.id}`}
										className=" rounded-lg hover:bg-gray-800 flex flex-col"
									>
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-auto "
										/>
										<h3 className="text-[16px] text-[#FFFFFF] font-medium mt-5">
											{item.name}
										</h3>
										{/* <p className="text-[14px] text-[#9EA6B8] mt-2">
											{item.description}
										</p> */}
										<p className="text-xl">
											Price: {Number(item.price).toFixed(2)} {currency}
										</p>
									</Link>
								</div>
							</>
						))}
					</div>
				</div>
			)}

			{clothingsCat?.length > 0 && (
				<div className="px-4 md:px-8 lg:px-[160px]">
					<h2 className="text-3xl text-[#FFFFFF] font-semibold my-5">
						Clothing
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4">
						{clothingsCat.map((item) => (
							<>
								<div key={item.id} className="">
									<Link
										href={`/item/${item.id}`}
										className=" rounded-lg hover:bg-gray-800 flex flex-col"
									>
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-auto "
										/>
										<h3 className="text-[16px] text-[#FFFFFF] font-medium mt-5">
											{item.name}
										</h3>
										{/* <p className="text-[14px] text-[#9EA6B8] mt-2">
											{item.description}
										</p> */}
										<p className="text-xl">
										Price: {Number(item.price).toFixed(2)} {currency}
										</p>
									</Link>
								</div>
							</>
						))}
					</div>
				</div>
			)}

			{petsCat.length > 0 && (
				<div className="px-4 md:px-8 lg:px-[160px]">
					<h2 className="text-3xl text-[#FFFFFF] font-semibold my-5">Pets</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 my-4">
						{petsCat.map((item) => (
							<>
								<div key={item.id} className="">
									<Link
										href={`/item/${item.id}`}
										className=" rounded-lg hover:bg-gray-800 flex flex-col"
									>
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-auto "
										/>
										<h3 className="text-[16px] text-[#FFFFFF] font-medium mt-5">
											{item.name}
										</h3>
										{/* <p className="text-[14px] text-[#9EA6B8] mt-2">
											{item.description}
										</p> */}
										<p className="text-xl">
										Price: {Number(item.price).toFixed(2)} {currency}
										</p>
									</Link>
								</div>
							</>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Categories;
