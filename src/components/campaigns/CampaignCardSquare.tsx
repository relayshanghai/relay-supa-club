import Link from "next/link";
import Image from "next/legacy/image";
import { ChartBarIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import type {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactNode,
  ReactPortal,
} from "react";
import { useState, useEffect } from "react";
import type { CampaignDB } from "src/utils/api/db";
import { useTranslation } from "react-i18next";

import { useCompany } from "src/hooks/use-company";
import { useClientDb } from "src/utils/client-db/use-client-db";
import { useCampaignCreators } from "src/hooks/use-campaign-creators";

export default function CampaignCardSquare({
  campaign,
}: {
  campaign: CampaignDB;
}) {
  const { t } = useTranslation();
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const { company } = useCompany();
  const { supabaseClient } = useClientDb();

  const { campaignCreators } = useCampaignCreators({
    campaign,
  });

  // get the number of creators in each status
  const creatorsCount = (status: string) => {
    return campaignCreators?.filter((c) => c.status === status).length ?? 0;
  };

  useEffect(() => {
    const getFiles = async () => {
      const getFilePath = (filename: string) => {
        const {
          data: { publicUrl },
        } = supabaseClient.storage
          .from("images")
          .getPublicUrl(`campaigns/${campaign?.id}/${filename}`);
        return publicUrl;
      };

      const { data } = await supabaseClient.storage
        .from("images")
        .list(`campaigns/${campaign?.id}`, {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });

      if (data?.[0]?.name) {
        const imageUrl = `${getFilePath(data?.[0]?.name)}`;
        setCoverImageUrl(imageUrl);
      }
    };
    if (campaign) {
      getFiles();
    }
  }, [campaign, supabaseClient.storage]);

  return (
    <Link href={`/campaigns/${campaign.id}`} passHref>
      <div className="relative h-80 cursor-pointer rounded-lg bg-white duration-300 sm:hover:shadow-lg">
        {/* -- Campaign Card Image -- */}
        <div className="relative mb-2 h-48 w-full rounded-lg">
          <Image
            src={coverImageUrl || "/assets/imgs/image404.png"}
            alt="card-image"
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
            className="h-full w-full rounded-lg"
          />
          <div className="absolute bottom-0 left-2 mb-1 flex flex-wrap">
            {!!campaign?.tag_list?.length &&
              campaign?.tag_list.map(
                (
                  tag:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | ReactFragment
                    | ReactPortal
                    | Iterable<ReactNode>
                    | null
                    | undefined,
                  index: Key | null | undefined
                ) => (
                  <div
                    key={index}
                    className="leading-sm mb-1 mr-1 inline-block flex-shrink-0 items-center rounded-md bg-tertiary-50/60 px-2 py-1 text-xs text-tertiary-600">
                    {tag}
                  </div>
                )
              )}
          </div>
          <div className="absolute right-2 top-2 inline-block rounded-md bg-primary-50/60 px-2 py-1 text-xs text-primary-500">
            {t(`campaigns.show.status.${campaign?.status}`)}
          </div>
        </div>
        <div className="px-2">
          {/* -- Campaign Card Text -- */}
          <div>
            <div className="text-sm font-semibold text-tertiary-600">
              {campaign.name}
            </div>
            <div className="mb-2 text-xs text-tertiary-600">
              {company?.name}
            </div>
            <div className="flex flex-wrap items-center">
              {/* TODO: fix the counts and switch tabs on next PR */}
              {
                //@ts-ignore
                campaign?.status_counts &&
                  //@ts-ignore
                  Object.entries(campaign?.status_counts).map(
                    (status, index) => (
                      <Link
                        key={index}
                        href={`/campaigns/${campaign.id}`}
                        legacyBehavior>
                        <div className="mb-2 mr-2 flex items-center rounded-md border border-gray-100 bg-primary-100 bg-opacity-60 px-1 py-0.5 text-xs text-gray-600 duration-300 hover:text-primary-500">
                          <div className="mr-1">
                            {t("campaigns.show.changeStatus")}
                          </div>
                          {/* <div>{status[1]}</div> */}
                        </div>
                      </Link>
                    )
                  )
              }
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {creatorsCount("to contact") > 0 && (
              <p>
                {t(`campaigns.show.activities.outreach.toContact`)}:{" "}
                {creatorsCount("to contact")}
              </p>
            )}

            {creatorsCount("contacted") > 0 && (
              <p>
                {t(`campaigns.show.activities.outreach.contacted`)}:{" "}
                {creatorsCount("contacted")}
              </p>
            )}

            {creatorsCount("confirmed") > 0 && (
              <p>
                {t(`campaigns.show.activities.outreach.confirmed`)}:{" "}
                {creatorsCount("confirmed")}
              </p>
            )}

            {creatorsCount("posted") > 0 && (
              <p>
                {t(`campaigns.show.activities.outreach.posted`)}:{" "}
                {creatorsCount("posted")}
              </p>
            )}
          </div>
          {/* -- Campaign Card Icons -- */}
          <div className="absolute bottom-2 right-0 flex items-center">
            <div className="mr-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-primary-500 bg-opacity-10 text-sm font-semibold text-primary-500 duration-300 hover:bg-opacity-20">
              <Link href={`/campaigns/${campaign.id}`} legacyBehavior>
                <ChartBarIcon
                  name="stats"
                  className="h-4 w-4 fill-current text-primary-500"
                />
              </Link>
            </div>
            <div className="mr-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-primary-500 bg-opacity-10 text-sm font-semibold text-primary-500 duration-300 hover:bg-opacity-20">
              <Link href={`/campaigns/form/${campaign.id}`} legacyBehavior>
                <PencilSquareIcon
                  name="edit"
                  className="h-4 w-4 fill-current text-primary-500"
                />
              </Link>
            </div>
          </div>
          {/* -- Campaign Card Icons Ends -- */}
        </div>
      </div>
    </Link>
  );
}
