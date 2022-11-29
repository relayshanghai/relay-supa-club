import {
  FiStar,
  FiGrid,
  FiCompass,
  FiHeadphones,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiActivity
} from "react-icons/fi";

export const tabs = (user) => [
  {
    title: "Applications",
    permissions: ['admin', 'user'],
    items: [
      {
        url: "/dashboard/campaigns",
        icon: <FiGrid size={20} />,
        title: "campaigns",
        eventName: "Campaigns",
        items: [],
      },
      {
        url: "/dashboard/creators",
        icon: <FiCompass size={20} />,
        title: "creators",
        eventName: "Creators",
        items: [],
      },
      {
        url: "/dashboard/pools",
        icon: <FiStar size={20} />,
        title: "resourcePools",
        eventName: "Resource Pools",
        items: [],
      },
      {
        url: `/dashboard/clients/${user?.company?.slug}`,
        icon: <FiBox size={20} />,
        title: "myCompany",
        eventName: "My Company",
        items: [],
      },
      {
        url: `/dashboard/settings/billing`,
        icon: <FiDollarSign size={20} />,
        title: "billing",
        eventName: "My Company",
        items: [],
      },
      // {
      //   url: "/",
      //   icon: <FiActivity size={20} />,
      //   title: "finance",
      //   eventName: 'Finance',
      //   items: [
      //     {
      //       url: "/social-feed",
      //       title: "plans",
      //       items: [],
      //     },
      //     {
      //       url: "/tasks",
      //       title: "transactions",
      //       items: [],
      //     },
      //     // {
      //     //   url: "/inbox",
      //     //   title: "Inbox",
      //     //   items: [],
      //     // },
      //     // {
      //     //   url: "/todo",
      //     //   title: "Todo",
      //     //   items: [],
      //     // },
      //   ],
      // },
      // {
      //   url: "/",
      //   icon: <FiList size={20} />,
      //   title: "Menu levels",
      //   items: Array.from(Array(4).keys()).map((i) => {
      //     return {
      //       url: "/",
      //       title: `Level 1-${i + 1}`,
      //       items: Array.from(Array(4).keys()).map((j) => {
      //         return {
      //           url: "/",
      //           title: `Level 2-${j + 1}`,
      //           items: Array.from(Array(4).keys()).map((k) => {
      //             return {
      //               url: "/",
      //               title: `Level 3-${k + 1}`,
      //               items: Array.from(Array(4).keys()).map((l) => {
      //                 return {
      //                   url: "/",
      //                   title: `Level 4-${l + 1}`,
      //                   items: [],
      //                 };
      //               }),
      //             };
      //           }),
      //         };
      //       }),
      //     };
      //   }),
      // },
    ],
  },
  {
    title: 'Admin',
    permissions: ['admin'],
    items: [
      {
        url: "/dashboard/clients",
        icon: <FiUsers size={20} />,
        title: "clients",
        eventName: "Clients",
        items: [],
      },
      {
        url: "/dashboard/csm",
        icon: <FiHeadphones size={20} />,
        title: "csm",
        eventName: "CSM",
        items: [],
      },
      {
        url: "/",
        icon: <FiActivity size={20} />,
        title: "finance",
        eventName: 'Finance',
        items: [
          {
            url: "/dashboard/finance/plans",
            title: "plans",
            items: [],
          },
          {
            url: "/dashboard/finance/transactions",
            title: "transactions",
            items: [],
          },
          // {
          //   url: "/inbox",
          //   title: "Inbox",
          //   items: [],
          // },
          // {
          //   url: "/todo",
          //   title: "Todo",
          //   items: [],
          // },
        ],
      },
    ]
  }
];