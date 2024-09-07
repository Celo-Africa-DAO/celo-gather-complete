import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "./ui/button";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import useCeloConnect from "./hooks/useCeloConnect";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Textarea } from "./ui/textarea";

const selectOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "pets", label: "Pets" },
];

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState<boolean>(false);
  const { connect } = useConnect();
  const { address } = useAccount();
  const { checkConnection, mundoContract } = useCeloConnect();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [owner, setOwner] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (window.ethereum && (window.ethereum as any).isMiniPay) {
      setHideConnectBtn(true);
      connect({ connector: injected({ target: "metaMask" }) });
    }

    window.ethereum.on("accountsChanged", () => {
      router.refresh();
    });

    // Listen for chain changes
    window.ethereum.on("chainChanged", () => {
      router.refresh();
    });

    // Clean up the event listeners when component unmounts
    return () => {
      window.ethereum.removeListener("accountsChanged", () => {
        router.refresh();
      });
      window.ethereum.removeListener("chainChanged", () => {
        router.refresh();
      });
    };
  }, [connect]);
  useEffect(() => {
    const getOwner = async () => {
      const connect = await checkConnection();
      if (!connect) return;
      if (window.ethereum) {
        const owner = await mundoContract?.owner();
        // console.log(owner);
        // console.log(address);
        setOwner(owner);
      }
    };
    mundoContract && address && getOwner();
  }, [address, mundoContract]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDescription(e.target.value);
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value);
  };
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPrice(e.target.value);
  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) =>
    setStock(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!checkConnection() || !mundoContract) {
        return;
      }
      toast.loading("Adding product");
      const newPrice = ethers.parseUnits(price, 6);
      const tx = await mundoContract.list(
        name,
        category,
        image,
        newPrice,
        0,
        stock,
        description
      );
      // console.log(newPrice);
      toast.dismiss();
      toast.loading("Waiting for network confirmation");
      const response = await tx.wait();
      // console.log(response);

      // Reset form after submission
      setName("");
      setDescription("");
      setImage("");
      setPrice("");
      setStock("");
      toast.dismiss();
      toast.success("Product added successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <header className="sticky bg-black top-0 z-30">
      <div className="p-3 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            src={"/logo/cag-logo.svg"}
            width={181}
            height={23}
            alt="cag logo"
          />
        </Link>

        <nav className="flex gap-3 items-center">
          {address === owner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-black hover:opacity-75"
                >
                  Add product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Add product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Fill the product details below to add to the products list.
                  </AlertDialogDescription>
                  <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div className="grid w-full text-white mt-4 space-y-1 items-center gap-1.5">
                      <Label className="text-white" htmlFor="name">
                        Product name
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        placeholder="A test product"
                        value={name}
                        className="text-white"
                        required
                        onChange={handleNameChange}
                      />
                    </div>
                    <div className="grid w-full space-y-1 items-center gap-1.5">
                      <Label className="text-white" htmlFor="description">
                        Description
                      </Label>
                      <Textarea
                        type="text"
                        id="description"
                        placeholder="This product is ..."
                        value={description}
                        required
                        className="text-white"
                        onChange={handleDescriptionChange}
                      />
                    </div>
                    <div className="grid w-full space-y-1 items-center gap-1.5">
                      <Label className="text-white" htmlFor="image">
                        Product image url
                      </Label>
                      <Input
                        type="text"
                        id="image"
                        required
                        className="text-white"
                        placeholder="https://www.example.com/product-image.png"
                        value={image}
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="grid w-full space-y-1 items-center gap-1.5">
                      <Label className="text-white" htmlFor="price">
                        Price ($)
                      </Label>
                      <Input
                        type="number"
                        id="price"
                        placeholder="$10"
                        required
                        className="text-white"
                        value={price}
                        onChange={handlePriceChange}
                      />
                    </div>
                    <div className="grid w-full space-y-1 items-center gap-1.5">
                      <Label className="text-white" htmlFor="price">
                        Category ($)
                      </Label>
                      <Select
                        required
                        onValueChange={(value) => setCategory(value)}
                      >
                        <SelectTrigger className="w-full text-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {selectOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-full space-y-1 items-center gap-1.5">
                      <Label className="text-white" htmlFor="stock">
                        Stock
                      </Label>
                      <Input
                        required
                        type="number"
                        id="stock"
                        className="text-white"
                        placeholder="4"
                        value={stock}
                        onChange={handleStockChange}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        type="button"
                        className="bg-red-700 hover:text-white hover:bg-red-500 border-0"
                      >
                        Cancel
                      </AlertDialogCancel>
                      <Button
                        type="submit"
                        className="bg-green-800 hover:bg-green-700"
                      >
                        Add product
                      </Button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* <Link
						href={"#"}
						className="p-2 bg-[#292E38] hover:opacity-70  rounded-xl ml-8"
					>
						<Search />
					</Link>
					<Link
						href={"#"}
						className="p-2 bg-[#292E38] hover:opacity-70  rounded-xl"
					>
						<UserRound />
					</Link>
					<Link
						href={"#"}
						className="p-2 bg-[#292E38] hover:opacity-70  rounded-xl"
					>
						<ShoppingBag />
					</Link> */}
          <Link
            href={"/categories"}
            className="p-2 bg-[#292E38] hover:opacity-70  rounded-xl"
          >
            Categories
          </Link>

          {!hideConnectBtn && (
            <ConnectButton
              showBalance={{
                smallScreen: true,
                largeScreen: false,
              }}
            />
          )}
        </nav>
      </div>
      <hr />
    </header>
  );
}
