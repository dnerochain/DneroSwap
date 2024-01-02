export const dneroswapProfileABI = [
  {
    inputs: [
      { internalType: 'contract IBEP20', name: '_wdneroToken', type: 'address' },
      { internalType: 'uint256', name: '_numberWDneroToReactivate', type: 'uint256' },
      { internalType: 'uint256', name: '_numberWDneroToRegister', type: 'uint256' },
      { internalType: 'uint256', name: '_numberWDneroToUpdate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'previousAdminRole', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'newAdminRole', type: 'bytes32' },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'account', type: 'address' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'RoleRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'teamId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'teamName', type: 'string' },
    ],
    name: 'TeamAdd',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'teamId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'numberPoints', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
    ],
    name: 'TeamPointIncrease',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'userAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'oldTeamId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newTeamId', type: 'uint256' },
    ],
    name: 'UserChangeTeam',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'userAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'teamId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'nftAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'UserNew',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'userAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'teamId', type: 'uint256' },
    ],
    name: 'UserPause',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'userAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'numberPoints', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
    ],
    name: 'UserPointIncrease',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address[]', name: 'userAddresses', type: 'address[]' },
      { indexed: false, internalType: 'uint256', name: 'numberPoints', type: 'uint256' },
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
    ],
    name: 'UserPointIncreaseMultiple',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'userAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'teamId', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'nftAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'UserReactivate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'userAddress', type: 'address' },
      { indexed: false, internalType: 'address', name: 'nftAddress', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'UserUpdate',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'NFT_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'POINT_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'SPECIAL_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_nftAddress', type: 'address' }],
    name: 'addNftAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_teamName', type: 'string' },
      { internalType: 'string', name: '_teamDescription', type: 'string' },
    ],
    name: 'addTeam',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wdneroToken',
    outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_userAddress', type: 'address' },
      { internalType: 'uint256', name: '_newTeamId', type: 'uint256' },
    ],
    name: 'changeTeam',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'claimFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_teamId', type: 'uint256' },
      { internalType: 'address', name: '_nftAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'createProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'getRoleMember',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleMemberCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_teamId', type: 'uint256' }],
    name: 'getTeamProfile',
    outputs: [
      { internalType: 'string', name: '', type: 'string' },
      { internalType: 'string', name: '', type: 'string' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bool', name: '', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_userAddress', type: 'address' }],
    name: 'getUserProfile',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bool', name: '', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'hasRegistered',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_teamId', type: 'uint256' },
      { internalType: 'uint256', name: '_numberPoints', type: 'uint256' },
      { internalType: 'uint256', name: '_campaignId', type: 'uint256' },
    ],
    name: 'increaseTeamPoints',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_userAddress', type: 'address' },
      { internalType: 'uint256', name: '_numberPoints', type: 'uint256' },
      { internalType: 'uint256', name: '_campaignId', type: 'uint256' },
    ],
    name: 'increaseUserPoints',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_userAddresses', type: 'address[]' },
      { internalType: 'uint256', name: '_numberPoints', type: 'uint256' },
      { internalType: 'uint256', name: '_campaignId', type: 'uint256' },
    ],
    name: 'increaseUserPointsMultiple',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_teamId', type: 'uint256' }],
    name: 'makeTeamJoinable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_teamId', type: 'uint256' }],
    name: 'makeTeamNotJoinable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberActiveProfiles',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberWDneroToReactivate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberWDneroToRegister',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberWDneroToUpdate',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberTeams',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { inputs: [], name: 'pauseProfile', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'address', name: '_nftAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'reactivateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_teamId', type: 'uint256' },
      { internalType: 'uint256', name: '_numberPoints', type: 'uint256' },
    ],
    name: 'removeTeamPoints',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_userAddress', type: 'address' },
      { internalType: 'uint256', name: '_numberPoints', type: 'uint256' },
    ],
    name: 'removeUserPoints',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_userAddresses', type: 'address[]' },
      { internalType: 'uint256', name: '_numberPoints', type: 'uint256' },
    ],
    name: 'removeUserPointsMultiple',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_teamId', type: 'uint256' },
      { internalType: 'string', name: '_teamName', type: 'string' },
      { internalType: 'string', name: '_teamDescription', type: 'string' },
    ],
    name: 'renameTeam',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_newNumberWDneroToReactivate', type: 'uint256' },
      { internalType: 'uint256', name: '_newNumberWDneroToRegister', type: 'uint256' },
      { internalType: 'uint256', name: '_newNumberWDneroToUpdate', type: 'uint256' },
    ],
    name: 'updateNumberWDnero',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_nftAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'updateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
