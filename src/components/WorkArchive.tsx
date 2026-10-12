import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";

export default function WorkArchive() {
  return <section id="workbench" className="workbench" aria-labelledby="workbench-title">
    <Link className="workbench-index" href="/projects" aria-label={`Explore all ${portfolioProjects.length} projects`}>
      <div className="workbench-copy">
        <p className="eyebrow">03 / The rest of the work</p>
        <h2 id="workbench-title">A few highlights.<br /><em>A longer story.</em></h2>
        <p className="workbench-description">Client collaborations, storefronts and weekend experiments. Filed here, when you want to go deeper.</p>
        <span className="workbench-link">Explore all {portfolioProjects.length} projects <ArrowUpRight size={19} /></span>
      </div>
      <div className="workbench-files" aria-hidden="true">
        <div className="workbench-file"><span>03 / EXPERIMENTS</span></div>
        <div className="workbench-file"><span>02 / COLLABORATIONS</span></div>
        <div className="workbench-file"><span>01 / PRODUCT ENGINEERING</span><strong>{portfolioProjects.length}<small>PROJECT<br />FILES</small></strong><div className="workbench-file-footer"><span>BH / SELECTED ARCHIVE</span><ArrowUpRight size={22} /></div></div>
      </div>
    </Link>
  </section>;
}
