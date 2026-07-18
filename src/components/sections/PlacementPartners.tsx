export default function PlacementPartners() {
  const companies = [
    { name: "TCS", logo: "TCS" },
    { name: "Infosys", logo: "Infosys" },
    { name: "Wipro", logo: "Wipro" },
    { name: "HCL", logo: "HCL" },
    { name: "Tech Mahindra", logo: "Tech Mahindra" },
    { name: "Cognizant", logo: "Cognizant" },
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Our Placement Partners
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            Top Companies Recruit Our Students
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {companies.map((company) => (
            <div
              key={company.name}
              className="bg-light-gray rounded-xl p-6 flex items-center justify-center hover:shadow-md transition-all group border border-gray-100"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-navy/30 group-hover:text-navy transition-colors tracking-tight">
                  {company.logo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
