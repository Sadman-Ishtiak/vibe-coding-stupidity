import HeroSection from '@/components/home/HeroSection';
import ProcessSection from '@/components/home/ProcessSection';
import CategorySection from '@/components/home/CategorieSection';
import JobSection from '@/components/home/JobSection';
import CTASection from '@/components/home/CTASection';

const Home = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <JobSection />
      <ProcessSection />
      <CTASection />
    </>
  );
};

export default Home;
