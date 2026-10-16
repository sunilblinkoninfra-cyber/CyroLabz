import ServiceDetailPage, { generateMetadata } from "../services/[slug]/page";

export { generateMetadata };

export default async function AuditsAliasPage() {
  return <ServiceDetailPage params={Promise.resolve({ slug: "audits" })} />;
}
