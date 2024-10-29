import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useEditHistory } from '@/hooks/useEditCallHistory';
import { useState } from 'react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const {
    isOpen,
    onOpen: handleEditDialogOpen,
    setData: setUpdateClientDetailsData,
  } = useEditHistory();
  const [audioUrl, setAudioUrl] = useState('');

  const downloadAudio = async (recordingPath) => {
    // Fetch the audio file using axios

    try {
      const BASE_URL = import.meta.env.VITE_API_URL;

      fetch(`${BASE_URL}/v1/calls/getRecording`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recordingPath }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch audio file');
          }
          return response.blob();
        })
        .then((blob) => {
          // Create a URL for the Blob and set it as the audio source
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          const link = document.createElement('a');
          link.href = url;
          link.download = row.original.recording; // Default filename
          document.body.appendChild(link);
          link.click(); // Programmatically click the link to trigger download
          document.body.removeChild(link); // Clean up the link element
          window.URL.revokeObjectURL(url); // Release blob URL
        })
        .catch((error) => {
          console.error('Error fetching audio:', error);
        });
    } catch (error) {
      console.error('Error fetching audio file:', error);
    }
  };

  console.log('Recording to download', audioUrl);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            handleEditDialogOpen();
            setUpdateClientDetailsData(row.original);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          {/* <a href="/VTSLogger_incoming_9386_20241021151717.wav" download>
            Download Recording
          </a> */}
          <Button
            className="p-0"
            variant="ghost"
            onClick={() => downloadAudio(row.original.recording)}
          >
            Download Recording
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
