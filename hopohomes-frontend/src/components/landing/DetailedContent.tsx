import WhyHopo from "./WhyHopo";
import ThreeTypes from "./ThreeTypes";
import AILayer from "./AILayer";
import ResidentsVsOwners from "./ResidentsVsOwners";
import Credibility from "./Credibility";

export default function DetailedContent() {
    return (
        <div className="flex flex-col w-full">
            <WhyHopo />
            <ThreeTypes />
            <ResidentsVsOwners />
            <AILayer />
            <Credibility />
        </div>
    );
}
