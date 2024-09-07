"use client";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import Loader from "./components/loader/page";
import { SyntheticEvent, useState } from "react";
import StoryCard from "./components/storyCard/page";
import textFieldSvg from "../app/assets/text-field.svg";

const Home = () => {
	const [content, setContent] = useState("");
	const [data, setData] = useState<{
		generating: boolean;
		responseData: null | { storyData: string, images?: [{ orderNumber: number, paragraph: string, imageUrl: string }] };
		error: string | null;
	}>({
		generating: false,
		responseData: null,
		error: null,
	});

	const formSubmitHandler = async (e: SyntheticEvent) => {
		e.preventDefault();
		if (content === "") {
			return toast.error("You cannot Generate Story of Blank Idea");
		}
		setData((prevState) => ({
			...prevState,
			generating: true,
			responseData: null,
			error: null,
		}));

		try {
			const response = await axios.post("/api/story", {
				content: content,
			});
			if (response.status === 200) {
				setData((prevState) => ({
					...prevState,
					generating: false,
					responseData: response?.data,
					error: null,
				}));
			}
		} catch (e: any) {
			setData((prevState) => ({
				...prevState,
				generating: false,
				responseData: null,
				error: e?.response?.data?.message,
			}));
		}

		setTimeout(() => {
			setData((prevState) => ({
				...prevState,
				generating: false,
			}));
			setContent("");
		}, 3000);
	};

	return (
		<div>
			{data.generating ? (
				<Loader />
			) : (
				<>
					<h1 className="b-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
						Welcome to Story Spark Ai
					</h1>
					<div className="flex flex-wrap justify-center items-center mt-1">
						<Image
							src={textFieldSvg}
							alt="Text Field SVG"
							height={200}
							width={400}
						/>
					</div>
					<div>
						{data.error && (
							<>
								<div
									className="p-4 mb-4 text-sm font-bold text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
									role="alert"
								>
									<span>Error!</span> {data.error}.
								</div>
							</>
						)}

						{/* <div className="flex justify-center items-center my-1">
							<p className="border border-black p-2 max-w-lg text-1xl leading-normal text-gray-900 dark:text-white">
								{data.responseData?.data as string}
							</p>
						</div> */}
						{(data?.responseData?.storyData as string) && (
							<div
								className="bg-blue-100 border-t mx-2 my-2 border-b border-blue-500 text-blue-700 px-4 py-3"
								role="alert"
							>
								<p className="font-bold">Generated Story:</p>
								<p className="text-sm">{data?.responseData?.storyData as string}</p>
							</div>
						)}
						{data?.responseData?.images?.length && (<>
							{ data?.responseData?.images.map((image, index) => 
								<StoryCard 
									paragraph={image.paragraph}
									imageUrl={image.imageUrl}  
									key={index}
								/>
								)
							}
						</>)}
					</div>
					<div className="flex justify-center items-center">
						<form onSubmit={formSubmitHandler}>
							<h1 className="b-4 text-center font-extrabold">
								Share your story idea
							</h1>
							<textarea
								value={content}
								onChange={(e) => {
									setContent(e.target.value);
								}}
								rows={15}
								cols={100}
								className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Write your Story Idea..."
								disabled={data.generating}
							></textarea>
							<div className="flex justify-center items-center mt-2">
								<button
									type="submit"
									className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
									disabled={data.generating}
								>
									{data.generating ? "Generating Story" : "Generate Story"}
								</button>
							</div>
						</form>
					</div>
				</>
			)}
		</div>
	);
};

export default Home;
