"use client"
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import UserOrders, { Order } from "@/components/UserOrder";
import { useAccount } from "wagmi";
import useCeloConnect from "@/hooks/useCeloConnect";

const OrdersPage: React.FC = () => {
	const { checkConnection, mundoContract } = useCeloConnect();
	const { address, chainId, isConnected } = useAccount();

	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
        console.log("first")
		const fetchOrders = async () => {
			try {
				let decimal: number;
				if (chainId === 44787) {
					decimal = 6;
				} else if (chainId === 42220) {
					decimal = 18;
				}
				if (!mundoContract) return;
				const fetchedOrders = await mundoContract.getAllOrders(address); 
                // console.log(fetchedOrders);

				const formattedOrders = fetchedOrders.map((order: any) => {
					return {
                        time: Number(order[0]), 
						item: {
							id: Number(order[1][0]),
							name: order[1][1],
							category: order[1][2],
							image: order[1][3],
							cost: Number(ethers.formatUnits(order[1][4], decimal)),
							rating: Number(order[1][5]),
							stock: Number(order[1][6]),
							description: order[1][7],
						},
					};
				});
				console.log(formattedOrders);
				setOrders(formattedOrders);
			} catch (error) {
				console.error("Error fetching orders:", error);
			}
		};

		isConnected && fetchOrders();
	}, [chainId,  mundoContract]);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Your Order History</h1>
			<UserOrders orders={orders} />
		</div>
	);
};

export default OrdersPage;
