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
  const [department, updateDepartment] = useState('서울대학교'); // 초기값 설정
  const [team, updateTeam] = useState('1'); // team 상태 추가

  setDepartment(department); // 부모 컴포넌트로 상태 전달
  setTeam(team); // 부모 컴포넌트로 상태 전달

  // Local updater for department
  const handleDepartmentChange = (newDepartment: string) => {
    updateDepartment(newDepartment); // 로컬 상태 업데이트
    setDepartment(newDepartment); // 상위 컴포넌트 상태 업데이트
  };

  // Local updater for team
  const handleTeamChange = (newTeam: string) => {
    updateTeam(newTeam); // 로컬 상태 업데이트
    setTeam(newTeam); // 상위 컴포넌트 상태 업데이트
  };

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

      {/* Department Section */}
      <div className="mt-4 space-y-2">
        <label>학교</label>
        <div className="text-xs">
          <select
            value={department}
            // update the department state and the department variable
            onChange={e => handleDepartmentChange(e.target.value)}
          >
            <option value="경기과학기술대">경기과학기술대</option>
            <option value="경상국립대">경상국립대</option>
            <option value="서울대학교">서울대학교</option>
            <option value="서울시립대">서울시립대</option>
            <option value="숙명여자대">숙명여자대</option>
            <option value="숭실대">숭실대</option>
            <option value="전남대">전남대</option>
            <option value="전주대">전주대</option>
            <option value="전북대">전북대</option>
            <option value="충남대">충남대</option>
            <option value="한동대">한동대</option>
          </select>
        </div>
      </div>

      {/* Team Section */}
      <div className="mt-4 space-y-2">
        <Label>팀</Label>
        <div className="text-xs">
          <select value={team} onChange={e => handleTeamChange(e.target.value)}>
            <option value="1">team 1</option>
            <option value="2">team 2</option>
            <option value="3">team 3</option>
            <option value="4">team 4</option>
            <option value="5">team 5</option>
            <option value="6">team 6</option>
            <option value="7">team 7</option>
            <option value="8">team 8</option>
            <option value="9">team 9</option>
            <option value="10">team 10</option>
            <option value="11">team 11</option>
            <option value="12">team 12</option>
            <option value="13">team 13</option>
            <option value="14">team 14</option>
            <option value="15">team 15</option>
            <option value="16">team 16</option>
            <option value="17">team 17</option>
            <option value="18">team 18</option>
            <option value="19">team 19</option>
            <option value="20">team 20</option>
          </select>
        </div>
      </div>
    </>
  );
};
