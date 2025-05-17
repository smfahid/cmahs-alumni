import { Users } from "lucide-react"

export function CommitteesSection() {
  const committees = [
    {
      id: "board",
      name: "Board of Trustees",
      description: "The governing body responsible for strategic decisions and oversight.",
      icon: <Users className="h-12 w-12 text-white" />,
    },
    {
      id: "ec",
      name: "EC Council",
      description: "The executive committee responsible for day-to-day operations and implementation of decisions.",
      icon: <Users className="h-12 w-12 text-white" />,
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Committees</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {committees.map((committee) => (
            <div key={committee.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="bg-primary rounded-full p-4 mb-6">{committee.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{committee.name}</h3>
                <p className="text-gray-600">{committee.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
