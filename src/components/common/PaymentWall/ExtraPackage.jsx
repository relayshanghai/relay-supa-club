/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import http from '@/libs/networking/http';
import { toast } from 'react-toastify';
import { handleError } from '@/libs/utils/utils';
import { useState } from 'react';
import Icon from '@/res/images/Icon';
import StackedCards from '../StackedCards/StackedCards';

export default function ExtraPackage({ closeModal }) {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { register, handleSubmit, formState: { errors }} = useForm({});
  const { t } = useTranslation();

  // const getName = () => {
  //   if (user) {
  //     const { first_name, last_name } = user;
  //     const fullName = `${first_name || ''} ${last_name || ''}`;
  //     return fullName.trim() ? fullName : user.nickname
  //   }
  // };

  // const getCompany = () => {
  //   if (user?.company) {
  //     return user?.company?.name
  //   }
  // };

  // const getContact = () => {
  //   if (user) {
  //     return user?.email || user?.phonenumber
  //   }
  // }

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
      <form onSubmit={handleSubmit((onSubmit))}>
        <div className="mb-6">
          <div className="text-gray-600 text-2xl font-semibold mb-4">Buy additional plans</div>
          <div className="text-gray-600 text-sm mb-4">Choose the package that fits your company.</div>
          {/* <div className="text-sm text-gray-600">{ getName() } at { getCompany() }. We will contact you on { getContact() } to schedule a meeting</div> */}
        </div>
        <div>
          <div className="mb-6">
            <StackedCards />
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
