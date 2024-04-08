import { Grid, Typography } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { useEffect, useState } from 'react';
import { Profile } from '../../constants/types';
import { deleteProfile, getProfiles } from '../../services/profile';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { loaderState } from '../../store/ShowLoader';
import { Add } from '@mui/icons-material';
import { ProfileCard } from '../../components/profile/ProfileCard';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { getSwalConfirmation } from '../../utils/swalConfirm';

export const Profiles = observer(() => {
  const { setLoading } = loaderState;
  const navigate = useNavigate();
  const [profileToEdit, setProfileToEdit] = useState<Profile | undefined>();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState<boolean>(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProfiles();
      if (error) toast.error(error || 'Faild to fetch profiles');
      else {
        setProfiles(data);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleEditProfileModalClose = async (refetch?: boolean) => {
    setEditProfileModalOpen(false);
    setProfileToEdit(undefined);
    if (refetch) await fetchProfiles();
  };

  const handleProfileToEdit = (profile: Profile) => {
    setProfileToEdit(profile);
    setEditProfileModalOpen(true);
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      if (!(await getSwalConfirmation())) return;
      setLoading(true);
      await deleteProfile(id);
      setProfiles((prev) => prev?.filter((profile) => profile?.id !== id));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MobileLayout profile={profileToEdit}>
      <Grid container sx={{ rowGap: '1.5vh', columnGap: '1.5vw', padding: '3vw' }}>
        <Grid
          item
          xs={5.9}
          sm={3.8}
          md={2.7}
          lg={1.8}
          sx={{
            width: '45vw',
            height: '28vh',
            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            backgroundColor: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => {
            navigate('/create-profile');
          }}
        >
          <Add sx={{ height: '64px', width: '64px', color: 'rgba(102, 9, 133, 1)' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(102, 9, 133, 1)',
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '12px',
              lineHeight: '18px',
            }}
          >
            Add New Profile
          </Typography>
        </Grid>
        {profiles?.map((profile) => (
          <ProfileCard
            onEditProfile={handleProfileToEdit}
            onDeleteProfile={handleDeleteProfile}
            profile={profile}
            key={profile?.id}
          />
        ))}
        <EditProfileModal onClose={handleEditProfileModalClose} open={editProfileModalOpen} profile={profileToEdit!} />
      </Grid>
    </MobileLayout>
  );
});
