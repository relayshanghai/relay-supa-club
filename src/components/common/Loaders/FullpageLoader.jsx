import Icon from "@/res/images/Icon"

export default function FullpageLoader() {
  return (
    <div className="w-screen h-screen column-center bg-secondary-50">
      <div className="column-center">
        <Icon name="layered-loader" className="fill-current text-primary-500 w-14 h-14 mb-4" />
        <div className="text-gray-600 text-sm">Did you know you can connect with millions of KOLs on relay.club?</div>
      </div>
    </div>
  )
}
