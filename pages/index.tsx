/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { Button } from 'src/components/button';
import CounterUp from 'src/components/counter-up';
import { Spinner } from 'src/components/icons';
import { Title } from 'src/components/title';
import { useUser } from 'src/hooks/use-user';

const Home = () => {
    const { profile, loading } = useUser();
    return (
        <div className="w-full h-full">
            <div className="flex flex-row justify-between px-10 py-8">
                <Title />
                <div>
                    {loading ? (
                        <Spinner className="w-5 h-5 fill-primary-600 text-white" />
                    ) : !profile?.id ? (
                        <div className="space-x-2">
                            <Link href="/signup">
                                <Button>Create account</Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="secondary">Log in</Button>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/dashboard" passHref>
                            <a className="text-sm px-4 py-2 rounded-md cursor-pointer flex-shrink-0 text-white bg-primary-500 hover:bg-primary-700 duration-300 font-bold disabled:bg-gray-300 disabled:cursor-default">
                                Dashboard
                            </a>
                        </Link>
                    )}
                </div>
            </div>
            <section
                className="xl:bg-contain bg-top bg-no-repeat -mt-24 pt-24"
                style={{ backgroundImage: "url('assets/imgs/backgrounds/intersect.svg')" }}
            >
                <div className="container px-4 mx-auto">
                    <div className="pt-12 text-center">
                        <div className="max-w-2xl mx-auto mb-8">
                            <h1 className="text-3xl lg:text-5xl lg:leading-normal mb-4 font-bold font-heading wow animate__animated animate__fadeIn">
                                <div>A complete </div>
                                <div>influencer management</div>
                                <div>software solution</div>
                            </h1>
                            <p className="text-blueGray-400 leading-relaxed wow animate__animated animate__fadeIn">
                                relay.club is an influencer management platform that provides a
                                complete solution for innovative brands and businesses to connect
                                with talented influencers.
                            </p>
                        </div>
                        <div>
                            <a
                                className="btn-primary py-4 px-8 mr-2 wow animate__animated animate__fadeIn hover-up-2"
                                href="/demo"
                            >
                                Request Demo
                            </a>
                        </div>
                    </div>
                </div>
                <div className="relative max-w-6xl mt-16 md:mt-8 mb-8 mx-auto">
                    <img src="/assets/imgs/elements/pattern.png" alt="Background design pattern" />
                    <div
                        className="absolute"
                        style={{ top: '9%', left: '14%', width: '72%', height: '66%' }}
                    >
                        <img
                            className="jump rounded wow animate__animated animate__fadeIn"
                            src="/assets/imgs/placeholders/dashboard-v5.png"
                            alt="relay club dashboard showing different Youtube Channels"
                        />
                    </div>
                </div>
                <div className="container px-4 mx-auto">
                    <div className="flex flex-wrap justify-between pt-8 pb-16">
                        <div
                            className="hover-up-5 flex w-1/2 lg:w-auto py-4 wow animate__animated animate__fadeIn"
                            data-wow-delay=".4s"
                        >
                            <div className="flex justify-center items-center bg-blueGray-50 text-primary-500 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <div className="sm:py-2 ml-2 sm:ml-6">
                                <span className="sm:text-2xl font-bold font-heading">+ </span>
                                <span className="sm:text-2xl font-bold font-heading count">
                                    <CounterUp count={170} time={3} />
                                </span>
                                <span className="sm:text-2xl font-bold font-heading"> m </span>
                                <p className="text-xs sm:text-base text-blueGray-400">
                                    Influencers
                                </p>
                            </div>
                        </div>
                        <div
                            className="hover-up-5 flex w-1/2 lg:w-auto py-4 wow animate__animated animate__fadeIn"
                            data-wow-delay=".6s"
                        >
                            <div className="flex justify-center items-center bg-blueGray-50 text-primary-500 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                            </div>
                            <div className="sm:py-2 ml-2 sm:ml-6">
                                <span className="sm:text-2xl font-bold font-heading count">
                                    <CounterUp count={50} time={3} />
                                </span>
                                <span className="sm:text-2xl font-bold font-heading">x </span>
                                <p className="text-xs sm:text-base text-blueGray-400">
                                    Faster Influencer Onboarding
                                </p>
                            </div>
                        </div>
                        <div
                            className="hover-up-5 flex w-1/2 lg:w-auto py-4 wow animate__animated animate__fadeIn"
                            data-wow-delay=".2s"
                        >
                            <div className="flex justify-center items-center bg-blueGray-50 text-primary-500 rounded-xl h-12 w-12 sm:h-20 sm:w-20">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                    />
                                </svg>
                            </div>
                            <div className="sm:py-2 ml-2 sm:ml-6">
                                <span className="sm:text-2xl font-bold font-heading count">
                                    $$$
                                </span>
                                <p className="text-xs sm:text-base text-blueGray-400">
                                    save marketing costs
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-8 pb-12 md:py-16 lg:py-16 overflow-x-hidden" id="key-features">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-wrap lg:flex-nowrap">
                        <div className="w-full lg:w-1/2">
                            <div
                                className="lg:py-6 lg:pr-77 wow animate__animated animate__fadeIn"
                                data-wow-delay=".3s"
                            >
                                <div className="mb-4">
                                    <span
                                        className="text-xs py-1 px-3 text-primary-500 font-semibold bg-primary-50 rounded-xl wow animate__animated animate__fadeInDown"
                                        data-wow-delay=".9s"
                                    >
                                        Why choose us
                                    </span>
                                    <h2
                                        className="text-4xl mt-5 font-bold font-heading wow animate__animated animate__fadeIn"
                                        data-wow-delay=".3s"
                                    >
                                        Key Features
                                    </h2>
                                </div>
                                <div
                                    className="flex items-start py-4 wow animate__animated animate__fadeIn"
                                    data-wow-delay=".5s"
                                >
                                    <div className="w-8 mr-5 text-primary-500">
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold font-heading">
                                            Discover millions of influencers
                                        </h3>
                                        <p className="text-blueGray-400 leading-loose">
                                            Using our recommendation algorithm, find the perfect
                                            influencer based on their followers, location, audience
                                            demographic and topics.{' '}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-start py-4 wow animate__animated animate__fadeIn"
                                    data-wow-delay=".7s"
                                >
                                    <div className="w-8 mr-5 text-primary-500">
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold font-heading">
                                            Manage your campaigns from start to finish.
                                        </h3>
                                        <p className="text-blueGray-400 leading-loose">
                                            Centralized and complete campaign management for your
                                            influencer marketing initiatives.{' '}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex items-start py-4 wow animate__animated animate__fadeIn"
                                    data-wow-delay=".9s"
                                >
                                    <div className="w-8 mr-5 text-primary-500">
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold font-heading">
                                            Hassle free payments
                                        </h3>
                                        <p className="text-blueGray-400 leading-loose">
                                            Pay your influencers through relay.club, and avoid the
                                            hassle of dealing with multiple invoices and payments.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full lg:w-1/2 my-12 lg:my-0">
                            <div
                                className="wow animate__animated animate__fadeIn"
                                data-wow-delay=".5s"
                            >
                                <img
                                    className="jump relative mx-auto rounded-xl w-full z-10"
                                    src="/assets/imgs/placeholders/img-1-v2.png"
                                    alt="Influencer profile: Pick Up Limes"
                                />
                                <img
                                    className="absolute top-0 left-0 w-40 -ml-12 -mt-12"
                                    src="/assets/imgs/elements/blob-tear.svg"
                                    alt="Design element"
                                />
                                <img
                                    className="absolute bottom-0 right-0 w-40 -mr-12 -mb-12"
                                    src="/assets/imgs/elements/blob-tear.svg"
                                    alt="Design element"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                id="plans"
                className="py-20 xl:bg-contain bg-top bg-no-repeat scroll-mt-32"
                style={{ backgroundImage: "url('assets/imgs/backgrounds/intersect.svg')" }}
            >
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2
                            className="max-w-lg mx-auto mb-4 text-4xl font-bold font-heading wow animate__animated animate__fadeIn"
                            data-wow-delay=".2s"
                        >
                            <span>Choose a</span>
                            <span className="text-primary-500"> plan </span>
                            <span>that works best for you</span>
                        </h2>
                        <p
                            className="max-w-sm mx-auto text-lg text-blueGray-400 wow animate__animated animate__fadeInDown"
                            data-wow-delay=".5s"
                        >
                            We'll do a free demo before you sign up!
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center -mx-3">
                        <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
                            <div
                                className="hover-up-5 pt-16 pb-8 px-4 text-center text-white bg-primary-500 rounded shadow wow animate__animated animate__fadeIn"
                                data-wow-delay=".4s"
                            >
                                <img
                                    className="h-20 mb-6 mx-auto"
                                    src="/assets/imgs/icons/agency.svg"
                                    alt="Saas Basic Pricing Plan for relay club"
                                />
                                <h3 className="mb-2 text-4xl font-bold font-heading">SaaS Basic</h3>
                                <p className="mt-2 mb-8 text-blueGray-400">
                                    Limited offer till 31/09/2022!
                                </p>
                                <div className="flex flex-col items-center mb-8">
                                    <ul>
                                        <li className="flex items-center mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="line-through text-left">
                                                Access to 2 out of 3 platforms
                                            </span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <div className="w-6 h-6 mr-2 text-white" />
                                            <span className="text-left">
                                                Access to all platforms
                                            </span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">
                                                Search over 170 million+ influencers
                                            </span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">
                                                350 unlocked profiles per month
                                            </span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left line-through">
                                                3x campaigns per month{' '}
                                            </span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <div className="w-6 h-6 mr-2 text-white" />
                                            <span className="text-left">Unlimited Campaigns</span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">1x seats </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <a
                                        className="block sm:inline-block py-4 px-6 mb-4 sm:mb-0 sm:mr-3 text-xs text-primary-500 font-semibold leading-none bg-white hover:bg-blueGray-50 rounded"
                                        href="/demo?referral=basic"
                                    >
                                        Request Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 lg:w-1/3 px-3 mb-6">
                            <div
                                className="hover-up-5 pt-16 pb-8 px-4 text-center bg-white rounded shadow wow animate__animated animate__fadeIn"
                                data-wow-delay=".2s"
                            >
                                <img
                                    className="h-20 mb-6 mx-auto"
                                    src="/assets/imgs/icons/startup.svg"
                                    alt="Saas + Pricing Plan for relay club"
                                />
                                <h3 className="mb-2 text-4xl font-bold font-heading">SaaS+</h3>
                                <p className="mt-2 mb-8 text-blueGray-400">
                                    Limited offer till 31/09/2022!
                                </p>
                                <div className="flex flex-col items-center mb-8">
                                    <ul className="text-blueGray-400">
                                        <li className="flex mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-primary-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">
                                                Dedicated Project Manager
                                            </span>
                                        </li>
                                        <li className="flex mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-primary-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">
                                                Access to all platforms
                                            </span>
                                        </li>
                                        <li className="flex mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-primary-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">
                                                Search over 170 million+ influencers
                                            </span>
                                        </li>
                                        <li className="flex mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-primary-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">
                                                500 unlocked profiles per month
                                            </span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-primary-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left line-through">
                                                5x campaigns per month{' '}
                                            </span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <div className="w-6 h-6 mr-2 text-primary-500" />
                                            <span className="text-left">Unlimited Campaigns</span>
                                        </li>
                                        <li className="flex items-center mb-3">
                                            <svg
                                                className="w-6 h-6 mr-2 text-primary-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span className="text-left">3x seats </span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <a
                                        className="block sm:inline-block py-4 px-6 mb-4 sm:mb-0 sm:mr-3 text-xs text-white text-center font-semibold leading-none bg-primary-400 hover:bg-primary-500 rounded"
                                        href="/demo?referral=plus"
                                    >
                                        Request Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="py-20 bg-top bg-no-repeat"
                style={{ backgroundImage: "url('assets/imgs/elements/blob.svg')" }}
            >
                <div className="container px-4 mx-auto">
                    <div className="relative py-20 px-4 lg:p-20">
                        <div className="max-w-lg mx-auto text-center">
                            <h2 className="mb-4 text-3xl lg:text-4xl font-bold font-heading wow animate__animated animate__fadeIn">
                                Get in touch to receive a product demo.
                            </h2>
                            <p
                                className="mb-8 text-blueGray-400 wow animate__animated animate__fadeIn"
                                data-wow-delay=".3s"
                            >
                                We'll provide a live demo based on your product, brand and
                                customers.
                            </p>
                            <div>
                                <a
                                    className="btn-primary py-4 px-8 mr-2 wow animate__animated animate__fadeIn hover-up-2"
                                    href="/demo"
                                >
                                    Request Demo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20">
                <div
                    className="container px-4 mx-auto wow animate__animated animate__fadeIn"
                    data-wow-delay=".3s"
                >
                    <div className="flex flex-wrap mb-12 lg:mb-20 -mx-3 text-center lg:text-left">
                        <div className="w-full lg:w-1/5 px-3 mb-6 lg:mb-0">
                            <Link href="/">
                                <a className="inline-block mx-auto lg:mx-0 text-3xl font-semibold leading-none">
                                    <img
                                        className="h-10"
                                        src="/assets/imgs/logos/relayclub-logo.png"
                                        alt="relay club logo"
                                    />
                                </a>
                            </Link>
                        </div>
                        <div className="w-full lg:w-2/5 px-3 mb-8 lg:mb-0">
                            <p className="max-w-md mx-auto lg:max-w-full lg:mx-0 lg:pr-32 lg:text-lg text-blueGray-400 leading-relaxed">
                                Helping <strong>maximize</strong> your influencer marketing ROI.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center lg:justify-between">
                        <div className="flex items-center">
                            <p className="text-sm text-blueGray-400 mr-4">
                                &copy; 2022. All rights reserved. 京ICP备2021039507号-2{' '}
                            </p>
                            <a className="mr-2 text-sm text-blueGray-400" href="/privacy">
                                Privacy
                            </a>
                            <a className="mr-2 text-sm text-blueGray-400" href="/terms">
                                TOS
                            </a>
                        </div>
                        <div className="order-first lg:order-last -mx-2 mb-4 lg:mb-0">
                            <a
                                className="inline-block px-2"
                                target="_blank"
                                href="https://facebook.com/relayclubAPAC"
                                rel="noreferrer"
                            >
                                <img
                                    src="/assets/imgs/icons/facebook-blue.svg"
                                    alt="Facebook Icon"
                                />
                            </a>
                            <a
                                className="inline-block px-2"
                                target="_blank"
                                href="https://twitter.com/RelayClub"
                                rel="noreferrer"
                            >
                                <img src="/assets/imgs/icons/twitter-blue.svg" alt="Twitter Icon" />
                            </a>
                            <a
                                className="inline-block px-2"
                                target="_blank"
                                href="https://www.instagram.com/relay.club/"
                                rel="noreferrer"
                            >
                                <img
                                    src="/assets/imgs/icons/instagram-blue.svg"
                                    alt="Instagram Icon"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
