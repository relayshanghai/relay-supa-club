/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux';
import { Switch } from '@headlessui/react'
import http from '@/libs/networking/http';
import { toast } from 'react-toastify';
import { handleError } from '@/libs/utils/utils';
import { useState } from 'react';
import Icon from '@/res/images/Icon';
import StackedCards from '../StackedCards/StackedCards';

export default function SubscriptionPackages({ closeModal }) {
  const [loading, setLoading] = useState(false);
  const [annualBillingEnabled, setAnnualBillingEnabled] = useState(true);
  const { user } = useSelector((state) => state.user);


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const onSubmit = async (data) => {
    const { email, phonenumber, remarks } = data;
    const content = `Oh boi! Someone wants an upgrade!\n\nCompany: ${user?.company?.name}\nUser ID: ${user.id}\nEmail: ${email}\nPhone: ${phonenumber}\nremarks: ${remarks}\nTime to get to work 🏋`;
    setLoading(true);
    try {
      const data = {
        text: content
      }
      await http.post(`account_requests`, data);
      toast('Request Sent');
      closeModal()
      setLoading(false);
    } catch (error) {
      toast(handleError(error));
      setLoading(false);
    }
  }

  return (
    <div className="w-full lg:w-1/2 lg:max-w-3xl py-20 px-14 bg-gray-50 h-full">
      <form>
        <div className="mb-6">
          <div className="text-gray-600 text-2xl font-semibold mb-4">Upgrade your account</div>
          <div className="text-gray-600 text-sm mb-4">Choose a plan that fits your company.</div>
          {/* <div className="text-sm text-gray-600">{ getName() } at { getCompany() }. We will contact you on { getContact() } to schedule a meeting</div> */}
        </div>
        <div>
          <div className="mb-6">
            <StackedCards />
            <Switch.Group as="div" className="flex items-center mt-4">
              <Switch
                checked={annualBillingEnabled}
                onChange={setAnnualBillingEnabled}
                className={classNames(
                  annualBillingEnabled ? 'bg-primary-500' : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors ease-in-out duration-200'
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    annualBillingEnabled ? 'translate-x-5' : 'translate-x-0',
                    'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
              <Switch.Label as="span" className="ml-3">
                <span className="text-sm font-medium text-gray-900">Annual billing </span>
                <span className="text-sm text-gray-500">(Save 10%)</span>
              </Switch.Label>
            </Switch.Group>
          </div>
          { loading 
          ? <button className="btn btn-primary w-full">
            <Icon name="loader-white" className="w-5 h-5" />
          </button>
          : <button type="submit" className="btn btn-primary w-full">Buy Now</button>
          }
        </div>
      </form>
    </div>
  )
}
