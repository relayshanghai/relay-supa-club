import CreatorCardSkeleton from "./CreatorCardSkeleton"

export default function CreatorGridSkeleton() {
  const creators = [1,2,3,4,5,6,7,8]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {creators.map((creator, index) => (
      <div key={index}>
        <CreatorCardSkeleton />
      </div>
    ))}
  </div>
  )
}
