import React from "react";

export default function ProductsPage() {
  return (
    <div className="mt-[52px] px-4 md:px-[56px]">
      <h4 className="lg:pl-[74px] font-Manrope mb-4 md:mb-[53px] text-[18px] md:text-[22px] leading-[24px] md:leading-[28px] font-bold text-[#FFFFFF]">
        NFT Product
      </h4>
      <div className="lg:pl-[40px] flex flex-col md:flex-row items-center md:items-start mb-[20px] md:mb-[40px]">
        <img
          src="/logo/product.svg"
          alt="Cryptovoxels"
          className="w-full md:w-[420px] lg:w-[580px] h-auto md:h-[251px] lg:h-[301px] mb-4 md:mb-0 md:mr-[40px] lg:mr-[103px]"
        />
        <div className="flex flex-col items-center md:items-start">
          <p className="lg:mt-[84px] text-[#FFFFFF] font-Manrope text-[28px] md:text-[36px] lg:text-[48px] leading-[36px] md:leading-[48px] lg:leading-[65.57px] font-medium mb-4 md:mb-[40px] lg:mb-[91px] text-center md:text-left">
            Cryptovoxels
          </p>
          <button className="lg:ml-[-61px] w-full md:w-[250px] lg:w-[417px] text-[14px] leading-[21px] font-manrope font-bold px-[16px] py-[8px] bg-[#1A5CE5] text-[#FFFFFF] rounded">
            View in...
          </button>
        </div>
      </div>

      <div className="lg:pl-[56px] mt-[60px] md:mt-[107px]">
        <h4 className="font-Manrope font-bold text-[18px] md:text-[22px] leading-[24px] md:leading-[28px] pt-[15px] w-full md:w-[850px]">
          Description
        </h4>
        <p className="mt-[25px] font-Manrope text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] w-full md:w-[850px] text-[#FFFFFF]">
          Horem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, <br />
          ac aliquet odio mattis. Suspendisse potenti. Mauris <br />
          blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla <br />
          quis lorem ut libero malesuada feugiat. Sed porttitor <br />
          lectus nibh. Donec rutrum congue leo eget malesuada.
        </p>
      </div>
      <div className="lg:pl-[56px] mt-[32px]">
        <h4 className="font-Manrope font-bold text-[18px] md:text-[22px] leading-[24px] md:leading-[28px] pt-[15px] w-full md:w-[850px]">
          Provenance
        </h4>
        <p className="mt-[25px] font-Manrope text-[16px] md:text-[18px] leading-[24px] md:leading-[26px] w-full md:w-[850px] text-[#FFFFFF]">
          Horem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div className="lg:pl-[56px] mt-[52px]">
        <h4 className="mb-[53px] font-Manrope font-bold text-[18px] md:text-[22px] leading-[24px] md:leading-[28px] w-[148px]">
          Current Price
        </h4>

        <div className="flex flex-col md:flex-row gap-[20px] md:gap-[40px]">
          <div className="mb-[66px] border-2 border-[#656565] w-full md:w-[380px] lg:w-[455px] h-[100px] md:h-[120px] flex flex-col justify-center px-4 md:pl-[20px] rounded-md">
            <span className="text-[#747474] font-Manrope font-bold leading-[28px] text-[16px] md:text-[18px]">
              Current Bid
            </span>
            <span className="text-[#FFFFFF] font-Manrope font-bold text-[24px] md:text-[28px] mt-[8px]">
              2.5 cUSDT
            </span>
          </div>

          <div className="mb-[66px] border-2 border-[#656565] w-full md:w-[380px] lg:w-[455px] h-[100px] md:h-[120px] flex flex-col justify-center px-4 md:pl-[20px] rounded-md">
            <span className="text-[#747474] font-Manrope font-bold leading-[28px] text-[16px] md:text-[18px]">
              Final Price
            </span>
            <span className="text-[#FFFFFF] font-Manrope font-bold text-[24px] md:text-[28px] mt-[8px]">
              0 cKes
            </span>
          </div>
        </div>
        <button className="mb-[100px] md:mb-[200px] w-full md:w-[250px] lg:w-[417px] text-[14px] leading-[21px] font-manrope font-bold px-[16px] py-[8px] bg-[#1A5CE5] text-[#FFFFFF] rounded">
          Place a bid
        </button>
      </div>
    </div>
  );
}