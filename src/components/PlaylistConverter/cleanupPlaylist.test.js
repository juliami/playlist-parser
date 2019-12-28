import React from 'react';
import { render } from '@testing-library/react';
import { cleanupPlaylist } from './cleanupPlaylist';
import { mockedInput, desiredOutput } from './__fixture__';


test('cleans up playlist', () => {
    const cleanedPlaylist = cleanupPlaylist(mockedInput);
    expect(cleanedPlaylist).toEqual(desiredOutput);
});



