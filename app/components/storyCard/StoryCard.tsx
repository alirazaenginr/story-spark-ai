import Image from "next/image";

type storyCardProps = {
  paragraph: string;
  imageUrl: string;
}

const StoryCard = (props: storyCardProps) => {
  return (
    <div className="mx-2 my-2 border border-black px-2 py-2">
      <div className="flex justify-center items-center">
        <Image
          src={props.imageUrl}
          height={500}
          width={500}
          alt="Image"
        />
      </div>
      <p className="tracking-widest text-gray-500 md:text-lg dark:text-gray-400 text-center font-bold">{props.paragraph}</p>
    </div>
  );
}

export default StoryCard;