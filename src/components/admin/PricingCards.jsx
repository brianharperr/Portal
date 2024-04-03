import { Segmented } from "antd";
import React, { useState } from "react";

const Pricing = ({openRegister}) => {

    const [pricingPeriod, setPricingPeriod] = useState('month');

  return (
    <section className="relative overflow-hidden bg-white pb-12 lg:pb-[90px] mx-auto w-full">
      <div className="">
        <div className="w-full px-4">
          <div className="mx-auto mb-4 max-w-[510px] text-center">
            <h2 className="mb-4 text-3xl font-bold text-dark sm:text-4xl md:text-[40px]">
              Choose what you need
            </h2>
            <p className="text-base text-body-color">
              We offer a plan for any kind of a home. View our <a href="#" className="text-blue-500 underline">live demos</a> to understand which plan is the right fit.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Segmented size='large' options={['Monthly', 'Annually']} onChange={(e) => setPricingPeriod(e === 'Monthly' ? 'month' : 'year')}/>
        </div>
        <div className="flex flex-wrap justify-center -mx-4 mt-10">
          <div className="flex flex-wrap mx-2">
            <PricingCard
              type="Basic"
              price={pricingPeriod === "month" ? "$200" : "$2,160"}
              subscription={pricingPeriod}
              description="Great for running your small home."
              buttonText="Choose Basic"
              openRegister={openRegister}
            >
              <List>Case Management</List>
              <List>Case Reports</List>
              <List>Free Updates</List>
              <List>Unlimited Users</List>
              <List>Email Alerts</List>
            </PricingCard>
            <PricingCard
              type="Business"
              price={pricingPeriod === "month" ? "$600" : "$6,480"}
              subscription={pricingPeriod}
              description="Optimize operations and track the important data to grow."
              buttonText="Choose Business"
              openRegister={openRegister}
              active
            >
              <List>Case Management</List>
              <List>Case Reports</List>
              <List>Basic Analytics</List>
              <List>Free Updates</List>
              <List>Toe Tags w/ QR codes</List>
              <List>Unlimited Users</List>
              <List>Email and SMS Alerts</List>
            </PricingCard>
            <PricingCard
              type="Enterprise"
              price={pricingPeriod === "month" ? "$1,500" : "$16,200"}
              subscription={pricingPeriod}
              description="Get everything you need to for unlimited growth."
              buttonText="Choose Enterprise"
              openRegister={openRegister}
            >
              <List>Case Management</List>
              <List>Case Reports</List>
              <List>Premium Analytics</List>
              <List>Free Updates</List>
              <List>Unlimited Users</List>
              <List>Email and SMS Alerts</List>
            </PricingCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

const PricingCard = ({
  children,
  description,
  price,
  type,
  subscription,
  buttonText,
  active,
  openRegister
}) => {
  return (
    <>
      <div className="w-full px-4 md:w-1/3">
        <div className="relative px-8 py-10 mb-10 overflow-hidden bg-white border rounded-xl border-primary border-opacity-20 shadow-pricing sm:p-12 lg:py-10 lg:px-6 xl:p-12">
          <span className="block mb-4 text-lg font-semibold text-primary">
            {type}
          </span>
          <h2 className="mb-5 text-[42px] font-bold text-dark">
            {price}
            <span className="text-base font-medium text-body-color">
              / {subscription}
            </span>
          </h2>
          <p className="mb-8 border-b border-[#F2F2F2] pb-8 text-base text-body-color">
            {description}
          </p>
          <ul className="mb-7">
            <p className="mb-1 text-base leading-loose text-body-color">
              {children}
            </p>
          </ul>
          <a
            onClick={openRegister}
            className={` ${
              active
                ? ` w-full block text-base font-semibold text-white bg-flgreen border border-primary rounded-md text-center p-4 hover:bg-opacity-90 transition`
                : `block w-full rounded-md border  border-[#D4DEFF] bg-transparent p-4 text-center text-base font-semibold text-flgreen transition hover:border-flgreen hover:bg-flgreen hover:text-white`
            } `}
          >
            {buttonText}
          </a>
          <div>
            <span className="absolute right-0 top-7 z-[1]">
              <svg
                width={77}
                height={172}
                viewBox="0 0 77 172"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx={86} cy={86} r={86} fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1={86}
                    y1={0}
                    x2={86}
                    y2={172}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3056D3" stopOpacity="0.09" />
                    <stop offset={1} stopColor="#C4C4C4" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="absolute right-4 top-4 z-[1]">
              <svg
                width={41}
                height={89}
                viewBox="0 0 41 89"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="38.9138"
                  cy="87.4849"
                  r="1.42021"
                  transform="rotate(180 38.9138 87.4849)"
                  fill="#295239"
                />
                <circle
                  cx="38.9138"
                  cy="74.9871"
                  r="1.42021"
                  transform="rotate(180 38.9138 74.9871)"
                  fill="#295239"
                />
                <circle
                  cx="38.9138"
                  cy="62.4892"
                  r="1.42021"
                  transform="rotate(180 38.9138 62.4892)"
                  fill="#295239"
                />
                <circle
                  cx="38.9138"
                  cy="38.3457"
                  r="1.42021"
                  transform="rotate(180 38.9138 38.3457)"
                  fill="#295239"
                />
                <circle
                  cx="38.9138"
                  cy="13.634"
                  r="1.42021"
                  transform="rotate(180 38.9138 13.634)"
                  fill="#295239"
                />
                <circle
                  cx="38.9138"
                  cy="50.2754"
                  r="1.42021"
                  transform="rotate(180 38.9138 50.2754)"
                  fill="#295239"
                />
                <circle
                  cx="38.9138"
                  cy="26.1319"
                  r="1.42021"
                  transform="rotate(180 38.9138 26.1319)"
                  fill="#295239"
                />
                <circle
                  cx="38.9138"
                  cy="1.42021"
                  r="1.42021"
                  transform="rotate(180 38.9138 1.42021)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="87.4849"
                  r="1.42021"
                  transform="rotate(180 26.4157 87.4849)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="74.9871"
                  r="1.42021"
                  transform="rotate(180 26.4157 74.9871)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="62.4892"
                  r="1.42021"
                  transform="rotate(180 26.4157 62.4892)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="38.3457"
                  r="1.42021"
                  transform="rotate(180 26.4157 38.3457)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="13.634"
                  r="1.42021"
                  transform="rotate(180 26.4157 13.634)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="50.2754"
                  r="1.42021"
                  transform="rotate(180 26.4157 50.2754)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="26.1319"
                  r="1.42021"
                  transform="rotate(180 26.4157 26.1319)"
                  fill="#295239"
                />
                <circle
                  cx="26.4157"
                  cy="1.4202"
                  r="1.42021"
                  transform="rotate(180 26.4157 1.4202)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="87.4849"
                  r="1.42021"
                  transform="rotate(180 13.9177 87.4849)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="74.9871"
                  r="1.42021"
                  transform="rotate(180 13.9177 74.9871)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="62.4892"
                  r="1.42021"
                  transform="rotate(180 13.9177 62.4892)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="38.3457"
                  r="1.42021"
                  transform="rotate(180 13.9177 38.3457)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="13.634"
                  r="1.42021"
                  transform="rotate(180 13.9177 13.634)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="50.2754"
                  r="1.42021"
                  transform="rotate(180 13.9177 50.2754)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="26.1319"
                  r="1.42021"
                  transform="rotate(180 13.9177 26.1319)"
                  fill="#295239"
                />
                <circle
                  cx="13.9177"
                  cy="1.42019"
                  r="1.42021"
                  transform="rotate(180 13.9177 1.42019)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="87.4849"
                  r="1.42021"
                  transform="rotate(180 1.41963 87.4849)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="74.9871"
                  r="1.42021"
                  transform="rotate(180 1.41963 74.9871)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="62.4892"
                  r="1.42021"
                  transform="rotate(180 1.41963 62.4892)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="38.3457"
                  r="1.42021"
                  transform="rotate(180 1.41963 38.3457)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="13.634"
                  r="1.42021"
                  transform="rotate(180 1.41963 13.634)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="50.2754"
                  r="1.42021"
                  transform="rotate(180 1.41963 50.2754)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="26.1319"
                  r="1.42021"
                  transform="rotate(180 1.41963 26.1319)"
                  fill="#295239"
                />
                <circle
                  cx="1.41963"
                  cy="1.4202"
                  r="1.42021"
                  transform="rotate(180 1.41963 1.4202)"
                  fill="#295239"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const List = ({ children }) => {
  return (
    <>
      <li className="mb-1 text-base leading-loose text-body-color">{children}</li>
    </>
  );
};
