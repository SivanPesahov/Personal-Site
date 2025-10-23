import GlassSurface from "./GlassSurface";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

function ProjectPicsCarusel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  return (
    <Carousel
      className="w-full max-w-3xl mx-auto"
      opts={{ align: "start", loop: true, containScroll: "trimSnaps" }}
    >
      <CarouselContent className="gap-0 px-0">
        {images.map((url, idx) => (
          <CarouselItem key={idx} className="basis-full">
            <div className="w-full aspect-[16/9] overflow-hidden">
              <GlassSurface width={"100%"} height={"100%"} borderRadius={24}>
                <img
                  src={url}
                  alt={`${title} — ${idx + 1}`}
                  className="w-full h-full object-cover rounded-3xl"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/1200x675/png?text=Image+not+available";
                  }}
                />
              </GlassSurface>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default ProjectPicsCarusel;
