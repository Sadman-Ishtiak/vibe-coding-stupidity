import CategoryCard from "./CategoryCard";

const categories = [
  {
    icon: "mdi mdi-laptop",
    title: "IT & Software",
    jobCount: "2024",
  },
  {
    icon: "mdi mdi-chip",
    title: "Technology",
    jobCount: "1250",
  },
  {
    icon: "mdi mdi-city",
    title: "Government",
    jobCount: "802",
  },
  {
    icon: "mdi mdi-bank",
    title: "Accounting / Finance",
    jobCount: "577",
  },
];

const CategoryView = () => {
  return (
    <div className="row">
      {categories.map((category, index) => (
        <CategoryCard key={index} {...category} />
      ))}
    </div>
  );
};

export default CategoryView;
