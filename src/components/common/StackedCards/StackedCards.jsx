/* This example requires Tailwind CSS v2.0+ */
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

const plans = [
  { name: 'Hobby', type: 'profiles', quantity: '500', price: '$40' },
  { name: 'Startup', type: 'profiles', quantity: '1000', price: '$80' },
  { name: 'Business', type: 'profiles', quantity: '2000', price: '$160' },
  { name: 'Enterprise', type: 'profiles', quantity: '8000', price: '$240' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function StackedCards() {
  const [selected, setSelected] = useState(plans[0])

  return (
    <RadioGroup value={selected} onChange={setSelected}>
      <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
      <div className="space-y-4">
        {plans.map((plan) => (
          <RadioGroup.Option
            key={plan.name}
            value={plan}
            className={({ checked, active }) =>
              classNames(
                checked ? 'border-transparent' : 'border-gray-300',
                active ? 'ring-2 ring-primary-500' : '',
                'relative block bg-white border rounded-lg shadow-sm px-6 py-4 cursor-pointer sm:flex sm:justify-between focus:outline-none'
              )
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex items-center">
                  <div className="text-sm">
                    <RadioGroup.Label as="p" className="font-medium text-gray-900">
                      {plan.name}
                    </RadioGroup.Label>
                    <RadioGroup.Description as="div" className="text-gray-500">
                      <p className="sm:inline">
                        {plan.quantity} {plan.type}
                      </p>{' '}
                      <span className="hidden sm:inline sm:mx-1" aria-hidden="true">
                        &middot;
                      </span>{' '}
                      <p className="sm:inline">1000 Searches</p>
                    </RadioGroup.Description>
                  </div>
                </div>
                <RadioGroup.Description as="div" className="mt-2 flex text-sm sm:mt-0 sm:block sm:ml-4 sm:text-right">
                  <div className="font-medium text-gray-900">{plan.price}</div>
                  {/* <div className="ml-1 text-gray-500 sm:ml-0">/mo</div> */}
                </RadioGroup.Description>
                <div
                  className={classNames(
                    active ? 'border' : 'border-2',
                    checked ? 'border-primary-500' : 'border-transparent',
                    'absolute -inset-px rounded-lg pointer-events-none'
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
