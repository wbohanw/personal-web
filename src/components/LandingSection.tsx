import Spline from "@splinetool/react-spline";
import CVpdf from "../bohancv.pdf";

type HeroSectionProps = {
  onToggleMusic: () => void;
};

export default function HeroSection({ onToggleMusic }: HeroSectionProps) {
  return (
    <>
      <section
        id="home"
        className="min-h-screen grid grid-cols-1 md:grid-cols-2 relative mx-auto px-8 md:px-24 py-24"
      >
        <div className="md:col-span-1 flex flex-col justify-center text-center md:text-left md:px-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 text-black dark:text-white leading-tight">
            Bohan
            <br />
            Wang
          </h1>
          <p className="text-xl max-w-xl mx-auto md:mx-0 md:text-left text-gray-600 dark:text-white/80">
            <p className="uppercase mb-16">
              Only 10 types of people
              <br /> in this beautiful HelloWorld 👋
            </p>
          </p>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start text-center">
            <a
              href={CVpdf}
              download
              className="w-48 px-8 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition-all duration-300 transform hover:-translate-y-1"
            >
              Download CV
            </a>
            <a
              href="mailto:bohanwang@mail.mcgill.ca"
              className="w-48 px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-300 transform hover:-translate-y-1"
            >
              Contact Me
            </a>
          </div>
          <div className="flex flex-wrap mt-4 gap-6 justify-center md:justify-start text-center">
            <a
              href="https://github.com/wbohanw"
              className="w-48 px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-medium transition-all duration-300 transform hover:-translate-y-1"
            >
              GitHub Repo
            </a>
            <a
              href="https://www.linkedin.com/in/bohan-wang-1a71b024a/"
              className="w-48 px-8 py-3 bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-medium transition-all duration-300 transform hover:-translate-y-1"
            >
              Let's Connect
            </a>
          </div>
        </div>

        <div className="items-center justify-center flex hidden md:flex">
          <div className="md:ml-0 w-full scale-100 sm:-ml-12 sm:scale-80 md:scale-120 lg:scale-180">
            <Spline
              scene="https://prod.spline.design/SaiarIHVInH3Qiv3/scene.splinecode"
              onClick={onToggleMusic}
              style={{
                cursor: "pointer",
                width: "180%",
                height: "100%",
                maxWidth: "170vw",
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      </section>

      {/* Mobile floating Spline button */}
      <div className="md:hidden rounded-full fixed bottom-0 right-0 z-30 w-32 h-32 flex items-center justify-center">
        <Spline
          scene="https://prod.spline.design/SaiarIHVInH3Qiv3/scene.splinecode"
          onClick={onToggleMusic}
          style={{
            cursor: "pointer",
            maxWidth: "320px",
            maxHeight: "320px",
            width: "90%",
            height: "90%",
            scale: "60%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        />
      </div>
    </>
  );
}
