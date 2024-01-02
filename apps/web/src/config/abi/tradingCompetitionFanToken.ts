export const tradingCompetitionFanTokenABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_dneroswapProfileAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_bunnyStationAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_wdneroTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_lazioTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_portoTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_santosTokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_competitionId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'enum TradingCompV2.CompetitionStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'competitionId',
        type: 'uint256',
      },
    ],
    name: 'NewCompetitionStatus',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'teamId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'competitionId',
        type: 'uint256',
      },
    ],
    name: 'TeamRewardsUpdate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'userAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'teamId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'competitionId',
        type: 'uint256',
      },
    ],
    name: 'UserRegister',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'userAddresses',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardGroup',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'competitionId',
        type: 'uint256',
      },
    ],
    name: 'UserUpdateMultiple',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'teamId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'competitionId',
        type: 'uint256',
      },
    ],
    name: 'WinningTeam',
    type: 'event',
  },
  {
    inputs: [],
    name: 'bunnyId',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'bunnyMintingStation',
    outputs: [
      {
        internalType: 'contract BunnyMintingStation',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wdneroToken',
    outputs: [
      {
        internalType: 'contract IBEP20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'claimWDneroRemainder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_userAddress',
        type: 'address',
      },
    ],
    name: 'claimInformation',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'claimLazioRemainder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'claimPortoRemainder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'claimSantosRemainder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'competitionId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentStatus',
    outputs: [
      {
        internalType: 'enum TradingCompV2.CompetitionStatus',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lazioToken',
    outputs: [
      {
        internalType: 'contract IBEP20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberTeams',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dneroswapProfile',
    outputs: [
      {
        internalType: 'contract IDneroswapProfile',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'portoToken',
    outputs: [
      {
        internalType: 'contract IBEP20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'santosToken',
    outputs: [
      {
        internalType: 'contract IBEP20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum TradingCompV2.CompetitionStatus',
        name: '_status',
        type: 'uint8',
      },
    ],
    name: 'updateCompetitionStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_teamId',
        type: 'uint256',
      },
      {
        internalType: 'uint256[5]',
        name: '_userCampaignIds',
        type: 'uint256[5]',
      },
      {
        internalType: 'uint256[5]',
        name: '_wdneroRewards',
        type: 'uint256[5]',
      },
      {
        internalType: 'uint256[5]',
        name: '_lazioRewards',
        type: 'uint256[5]',
      },
      {
        internalType: 'uint256[5]',
        name: '_portoRewards',
        type: 'uint256[5]',
      },
      {
        internalType: 'uint256[5]',
        name: '_santosRewards',
        type: 'uint256[5]',
      },
      {
        internalType: 'uint256[5]',
        name: '_pointRewards',
        type: 'uint256[5]',
      },
    ],
    name: 'updateTeamRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_addressesToUpdate',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: '_rewardGroup',
        type: 'uint256',
      },
    ],
    name: 'updateUserStatusMultiple',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_winningTeamId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenURI',
        type: 'string',
      },
      {
        internalType: 'uint8',
        name: '_bunnyId',
        type: 'uint8',
      },
    ],
    name: 'updateWinningTeamAndTokenURIAndBunnyId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userTradingStats',
    outputs: [
      {
        internalType: 'uint256',
        name: 'rewardGroup',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'teamId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'hasRegistered',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'hasClaimed',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'viewRewardTeams',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256[5]',
            name: 'userCampaignId',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'wdneroRewards',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'lazioRewards',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'portoRewards',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'santosRewards',
            type: 'uint256[5]',
          },
          {
            internalType: 'uint256[5]',
            name: 'pointUsers',
            type: 'uint256[5]',
          },
        ],
        internalType: 'struct TradingCompV2.CompetitionRewards[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'winningTeamId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const
