import { describe, it, expect } from 'vitest';
import { ApiError } from '@talentor/api-client';
import { toUserMessage } from './apiErrorMessage';

describe('toUserMessage', () => {
  const fallback = 'Something went wrong. Please try again.';

  it('maps status 0 to network message', () => {
    expect(toUserMessage(new ApiError(0, 'timeout'))).toBe(
      'Unable to reach the server. Check your connection and try again.',
    );
  });

  it('maps 413 to file too large', () => {
    expect(toUserMessage(new ApiError(413, 'large'))).toBe(
      'That file is too large.',
    );
  });

  it('maps 415 to unsupported file type', () => {
    expect(toUserMessage(new ApiError(415, 'bad'))).toBe(
      'Upload a PDF or Word (.doc, .docx) file.',
    );
  });

  it('maps 429 to busy message', () => {
    expect(toUserMessage(new ApiError(429, null))).toBe(
      'Resume processing is busy. Please try again shortly.',
    );
  });

  it('maps 422 with safe detail to backend detail', () => {
    expect(toUserMessage(new ApiError(422, 'Name is required.'))).toBe(
      'Name is required.',
    );
  });

  it('maps 422 with empty detail to validation fallback', () => {
    expect(toUserMessage(new ApiError(422, ''))).toBe(
      'Some fields need your review.',
    );
  });

  it('maps 422 with whitespace detail to validation fallback', () => {
    expect(toUserMessage(new ApiError(422, '   '))).toBe(
      'Some fields need your review.',
    );
  });

  it('maps 422 with null detail to validation fallback', () => {
    expect(toUserMessage(new ApiError(422, null))).toBe(
      'Some fields need your review.',
    );
  });

  it('maps 422 with long detail (>300) to validation fallback', () => {
    const long = 'a'.repeat(301);
    expect(toUserMessage(new ApiError(422, long))).toBe(
      'Some fields need your review.',
    );
  });

  it('trims 422 detail whitespace', () => {
    expect(toUserMessage(new ApiError(422, '  Name required  '))).toBe(
      'Name required',
    );
  });

  it('maps 409 with safe detail to backend detail', () => {
    expect(toUserMessage(new ApiError(409, 'Profile name exists'))).toBe(
      'Profile name exists',
    );
  });

  it('maps 409 with null detail to conflict fallback', () => {
    expect(toUserMessage(new ApiError(409, null))).toBe(
      'That name is already in use.',
    );
  });

  it('maps 409 with empty detail to conflict fallback', () => {
    expect(toUserMessage(new ApiError(409, ''))).toBe(
      'That name is already in use.',
    );
  });

  it('maps 409 with long detail to conflict fallback', () => {
    const long = 'b'.repeat(350);
    expect(toUserMessage(new ApiError(409, long))).toBe(
      'That name is already in use.',
    );
  });

  it('trims 409 detail whitespace', () => {
    expect(toUserMessage(new ApiError(409, '  taken  '))).toBe('taken');
  });

  it('maps 5xx to server failure', () => {
    expect(toUserMessage(new ApiError(500, 'err'))).toBe(
      'Resume processing failed. Please try again.',
    );
    expect(toUserMessage(new ApiError(502, 'err'))).toBe(
      'Resume processing failed. Please try again.',
    );
    expect(toUserMessage(new ApiError(503, null))).toBe(
      'Resume processing failed. Please try again.',
    );
    expect(toUserMessage(new ApiError(599, 'x'))).toBe(
      'Resume processing failed. Please try again.',
    );
  });

  it('maps unknown ApiError status to fallback', () => {
    expect(toUserMessage(new ApiError(400, 'bad'))).toBe(fallback);
    expect(toUserMessage(new ApiError(404, 'not found'))).toBe(fallback);
    expect(toUserMessage(new ApiError(401, 'unauthorized'))).toBe(fallback);
    expect(toUserMessage(new ApiError(418, 'teapot'))).toBe(fallback);
  });

  it('uses custom fallback for unknown status', () => {
    expect(toUserMessage(new ApiError(404, 'x'), 'Custom fallback')).toBe(
      'Custom fallback',
    );
  });

  it('returns fallback for non-ApiError', () => {
    expect(toUserMessage(new Error('oops'))).toBe(fallback);
    expect(toUserMessage('string error')).toBe(fallback);
    expect(toUserMessage(null)).toBe(fallback);
    expect(toUserMessage(undefined)).toBe(fallback);
    expect(toUserMessage({ status: 500, message: 'hi' })).toBe(fallback);
  });

  it('uses custom fallback for non-ApiError', () => {
    expect(toUserMessage(new Error('boom'), 'Try again later')).toBe(
      'Try again later',
    );
  });

  it('caps fallback length to 300', () => {
    const longFallback = 'x'.repeat(400);
    const result = toUserMessage(new Error('err'), longFallback);
    expect(result.length).toBe(300);
    expect(result).toBe('x'.repeat(300));
  });

  it('trims fallback whitespace', () => {
    expect(toUserMessage(new Error('err'), '  custom  ')).toBe('custom');
  });

  it('caps returned 422 detail is trimmed and within limit', () => {
    const detail = '  hi  ';
    expect(toUserMessage(new ApiError(422, detail))).toBe('hi');
  });

  it('handles ApiError with generic message as empty detail for 422', () => {
    const err = new ApiError(422, null);
    expect(err.message).toBe('Request failed with status 422');
    expect(toUserMessage(err)).toBe('Some fields need your review.');
  });

  it('handles ApiError with generic message as empty detail for 409', () => {
    const err = new ApiError(409, null);
    expect(toUserMessage(err)).toBe('That name is already in use.');
  });
});
