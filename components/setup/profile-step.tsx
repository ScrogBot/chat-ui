import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  PROFILE_DISPLAY_NAME_MAX,
  PROFILE_USERNAME_MAX,
  PROFILE_USERNAME_MIN
} from '@/db/limits';
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader2
} from '@tabler/icons-react';
import { FC, useCallback, useState } from 'react';
import { LimitDisplay } from '../ui/limit-display';
import { toast } from 'sonner';

import React, { useState, useCallback } from 'react';

interface ProfileStepProps {
  username: string;
  usernameAvailable: boolean;
  displayName: string;
  onUsernameAvailableChange: (isAvailable: boolean) => void;
  onUsernameChange: (username: string) => void;
  onDisplayNameChange: (name: string) => void;
  setTeam: (team: string | null) => void; // 수정
  setDepartment: (department: string | null) => void; // 수정
}

export const ProfileStep: FC<ProfileStepProps> = ({
  username,
  usernameAvailable,
  displayName,
  onUsernameAvailableChange,
  onUsernameChange,
  onDisplayNameChange,
  setTeam,
  setDepartment
}) => {
  const [loading, setLoading] = useState(false);

  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout | null;

    return (...args: any[]) => {
      const later = () => {
        if (timeout) clearTimeout(timeout);
        func(...args);
      };

      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username) return;

      if (username.length < PROFILE_USERNAME_MIN) {
        onUsernameAvailableChange(false);
        return;
      }

      if (username.length > PROFILE_USERNAME_MAX) {
        onUsernameAvailableChange(false);
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(username)) {
        onUsernameAvailableChange(false);
        toast.error(
          'Username must be letters, numbers, or underscores only - no other characters or spacing allowed.'
        );
        return;
      }

      setLoading(true);

      const response = await fetch(`/api/username/available`, {
        method: 'POST',
        body: JSON.stringify({ username })
      });

      const data = await response.json();
      const isAvailable = data.isAvailable;

      onUsernameAvailableChange(isAvailable);

      setLoading(false);
    }, 500),
    []
  );

  let team = null;
  let department;
  return (
    <>
      {/* Username Section */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Label>Username</Label>

          <div className="text-xs">
            {usernameAvailable ? (
              <div className="text-green-500">AVAILABLE</div>
            ) : (
              <div className="text-red-500">UNAVAILABLE</div>
            )}
          </div>
        </div>

        <div className="relative">
          <Input
            className="pr-10"
            placeholder="username"
            value={username}
            onChange={e => {
              onUsernameChange(e.target.value);
              checkUsernameAvailability(e.target.value);
            }}
            minLength={PROFILE_USERNAME_MIN}
            maxLength={PROFILE_USERNAME_MAX}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {loading ? (
              <IconLoader2 className="animate-spin" />
            ) : usernameAvailable ? (
              <IconCircleCheckFilled className="text-green-500" />
            ) : (
              <IconCircleXFilled className="text-red-500" />
            )}
          </div>
        </div>

        <LimitDisplay used={username.length} limit={PROFILE_USERNAME_MAX} />
      </div>

      {/* Display Name Section */}
      <div className="space-y-1">
        <Label>이름</Label>

        <Input
          placeholder="Your Name"
          value={displayName}
          onChange={e => onDisplayNameChange(e.target.value)}
          maxLength={PROFILE_DISPLAY_NAME_MAX}
        />

        <LimitDisplay
          used={displayName.length}
          limit={PROFILE_DISPLAY_NAME_MAX}
        />
      </div>

      {/* Team Section */}
      <div className="mt-4 space-y-2">
        <Label>팀</Label>
        <div className="flex space-x-2">
          {['Team A', 'Team B', 'Team C'].map(teamOption => (
            <button
              key={teamOption}
              className={`rounded border px-4 py-2 ${
                team === teamOption
                  ? 'bg-blue-500 text-white' // 선택된 항목 스타일
                  : 'bg-gray-100 text-gray-800' // 선택되지 않은 항목 스타일
              }`}
              onClick={() => setTeam(teamOption)} // 상태 업데이트
            >
              {teamOption}
            </button>
          ))}
        </div>
        {team && (
          <p className="text-sm text-gray-500">
            Selected Team: {team} {/* 선택된 팀 표시 */}
          </p>
        )}
      </div>

      {/* Department Section */}
      <div className="mt-4 space-y-2">
        <Label>소속</Label>
        <div className="flex space-x-2">
          {['서울대학교', '전북대학교'].map(departmentOption => (
            <button
              key={departmentOption}
              className={`rounded border px-4 py-2 ${
                department === departmentOption
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setDepartment(departmentOption)}
            >
              {departmentOption}
            </button>
          ))}
        </div>
        {department && (
          <p className="text-sm text-gray-500">
            Selected Department: {department}
          </p>
        )}
      </div>
    </>
  );
};
