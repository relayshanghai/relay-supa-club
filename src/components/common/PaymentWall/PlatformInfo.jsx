import PieChart from "@/components/icons/PieChart";
import Compass from "@/components/icons/Compass";
import Management from "@/components/icons/Management";
import Team from "@/components/icons/Team";
import Crm from "@/components/icons/Crm";
import { useTranslation } from "react-i18next";

export default function PlatformInfo() {
  const { t } = useTranslation();
  
  return (
    <div className="hidden lg:flex flex-col lg:w-1/2 max-w-3xl py-20 px-14 bg-white h-full">
      <div className="mb-6">
        <div className="text-gray-600 text-2xl font-semibold mb-4">{t('website.paymentWall.accountExpired')}</div>
        <div className="text-sm text-gray-600">{t('website.paymentWall.upgradeReason')}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="mb-10 mr-4 flex items-start">
          <div className="h-8 w-8 mr-2.5 mt-1 column-center flex-shrink-0 bg-primary-50 rounded-lg">
            <PieChart className="w-4 h-4 fill-current text-primary-500 flex-shrink-0" />
          </div>
          <div>
            <div className="text-gray-600 mb-2 font-semibold text-lg">{t('website.paymentWall.kolReporting')}</div>
            <div className="text-sm text-gray-600-">{t('website.paymentWall.kolReportingDesc')}</div>
          </div>
        </div>
        <div className="mb-10 mr-4 flex items-start">
          <div className="h-8 w-8 mr-2.5 mt-1 column-center flex-shrink-0 bg-primary-50 rounded-lg">
            <Compass className="w-4 h-4 fill-current text-primary-500 flex-shrink-0" />
          </div>
          <div>
            <div className="text-gray-600 mb-2 font-semibold text-lg">{t('website.paymentWall.kolDiscovery')}</div>
            <div className="text-sm text-gray-600-">{t('website.paymentWall.kolDiscoveryDesc')}</div>
          </div>
        </div>
        <div className="mb-10 mr-4 flex items-start">
          <div className="h-8 w-8 mr-2.5 mt-1 column-center flex-shrink-0 bg-primary-50 rounded-lg">
            <Management className="w-4 h-4 fill-current text-primary-500 flex-shrink-0" />
          </div>
          <div>
            <div className="text-gray-600 mb-2 font-semibold text-lg">{t('website.paymentWall.campaignManagement')}</div>
            <div className="text-sm text-gray-600-">{t('website.paymentWall.campaignManagementDesc')}</div>
          </div>
        </div>
        <div className="mb-10 mr-4 flex items-start">
          <div className="h-8 w-8 mr-2.5 mt-1 column-center flex-shrink-0 bg-primary-50 rounded-lg">
            <Team className="w-4 h-4 fill-current text-primary-500 flex-shrink-0" />
          </div>
          <div>
            <div className="text-gray-600 mb-2 font-semibold text-lg">{t('website.paymentWall.teamCollaboration')}</div>
            <div className="text-sm text-gray-600-">{t('website.paymentWall.teamCollaborationDesc')}</div>
          </div>
        </div>
        <div className="mb-10 mr-4 flex items-start">
          <div className="h-8 w-8 mr-2.5 mt-1 column-center flex-shrink-0 bg-primary-50 rounded-lg">
            <Crm className="w-4 h-4 fill-current text-primary-500 flex-shrink-0" />
          </div>
          <div>
            <div className="text-gray-600 mb-2 font-semibold text-lg">{t('website.paymentWall.kolPipeline')}</div>
            <div className="text-sm text-gray-600-">{t('website.paymentWall.kolPipelineDesc')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
