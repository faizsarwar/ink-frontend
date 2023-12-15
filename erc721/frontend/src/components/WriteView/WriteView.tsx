import { useState } from 'react';
import {
  Button,
  ConnectButton,
  NumberInput,
} from 'ui';
import { ChainContract, useTx, useWallet } from 'useink';
import { useTxNotifications } from 'useink/notifications';
import { isPendingSignature, shouldDisable } from 'useink/utils';

interface Props {
  erc721: ChainContract;
}

export const WriteView: React.FC<Props> = ({ erc721 }) => {
  const { account } = useWallet();

  const [mintTokenId, setMintTokenId] = useState(1);
  const mint = useTx<null>(erc721, 'mint');
  useTxNotifications(mint);

  if (!account) return <ConnectButton className='mt-6 mx-auto' />;

  return (
    <div>
      <div className='mt-6'>
      <ConnectButton className='mt-6 mx-auto' />
        <label className='mt-6 font-semibold uppercase text-xs'>Token ID</label>
        <NumberInput
          value={mintTokenId}
          min={1}
          max={10}
          onChange={setMintTokenId}
          placeholder='Enter a token ID to mint...'
          disabled={shouldDisable(mint)}
        />
        <Button
          className='w-full mt-3'
          disabled={shouldDisable(mint) || !mintTokenId}
          onClick={() =>
            mint.signAndSend([mintTokenId], { defaultCaller: true })
          }
        >
          {isPendingSignature(mint)
            ? 'Sign transaction'
            : shouldDisable(mint)
            ? 'Minting...'
            : 'Mint'}
        </Button>
      </div>

    </div>
  );
};
