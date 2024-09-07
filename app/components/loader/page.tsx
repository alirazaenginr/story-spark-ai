import Image from "next/image";
import LoaderSvg from "../../assets/loader.svg";

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Image
        src={LoaderSvg}
        alt="Loader"
      />
    </div>
  );
}

export default Loader;