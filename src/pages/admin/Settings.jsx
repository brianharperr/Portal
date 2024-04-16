import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	Divider,
	Input,
	Skeleton,
	Snackbar,
	Stack,
	Typography,
} from '@mui/joy';
import PageBuilder2 from '../../components/admin/PageBuilder2';
import { useDispatch, useSelector } from 'react-redux';
import {
	deletePortal,
	getSelectedPortal,
	select,
	update,
} from '../../redux/features/admin.portal.slice';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosWithAdminCredentials } from '../../configs/axios';
import ImageCropper from '../../components/profile/ImageCropper';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

export default function Settings() {
	const avatarFileInput = useRef(null);
	const dispatch = useDispatch();
	const { domain } = useParams();
	const portal = useSelector(getSelectedPortal);
	const navigate = useNavigate();
	const [settings, setSettings] = useState({
		ID: portal?.ID,
		Name: portal?.Name,
		Subdomain: portal?.Subdomain,
		Avatar: portal?.LogoSource,
	});
	const [errors, setErrors] = useState({
		Name: '',
		Subdomain: '',
	});
	const [imageCrop, setImageCrop] = useState({
		open: false,
		image: '',
	});
	const [deleteConfirmation, setDeleteConfirmation] = useState(false);
	const [isNameLoading, setIsNameLoading] = useState(false);
	const [isSubdomainLoading, setIsSubdomainLoading] = useState(false);

	const [message, setMessage] = useState({
		open: false,
		displayDuration: 3000,
		message: 'message undefined',
		color: 'primary',
	});

	const onImageSelect = (e) => {
		e.preventDefault();
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setImageCrop({ open: true, image: selectedFile });
		}
	};

	const transformDomainStr = (str) => {
		let newStr = str.toLowerCase();

		// Replace spaces with "-"
		newStr = newStr.replace(/\s+/g, '-');

		// Remove special characters
		newStr = newStr.replace(/[^\w\s-]/gi, '');
		setSettings({ ...settings, Subdomain: newStr });
	};

	const updateName = () => {
		setIsNameLoading(true);
		var payload = {
			ID: settings.ID,
			Name: settings.Name,
		};
		axiosWithAdminCredentials
			.patch('/portal/name', payload)
			.then((res) => {
				setMessage({
					open: true,
					message: "Your portal's name has been updated.",
					color: 'success',
					displayDuration: 3000,
				});
				var reduxPayload = {
					ID: payload.ID,
					Field: 'Name',
					Value: payload.Name,
				};
				dispatch(update(reduxPayload));
			})
			.catch((err) => {
				setMessage({
					open: true,
					message: 'Internal server error.',
					color: 'danger',
					displayDuration: 3000,
				});
			})
			.finally(() => setIsNameLoading(false));
	};

	const handleDelete = () => {
		dispatch(deletePortal(settings.ID))
			.unwrap()
			.then(() => {
				window.location.href = '/';
			})
			.catch(() => {
				setDeleteConfirmation(false);
				setMessage({
					open: true,
					message:
						'Could not delete portal due to an internal server error.\n Please try again in a few moments. If this issue persists please contact customer support',
					color: 'danger',
					displayDuration: null,
				});
			});
	};

	const updateSubdomain = () => {
		setIsSubdomainLoading(true);
		var payload = {
			ID: settings.ID,
			Subdomain: settings.Subdomain,
		};
		axiosWithAdminCredentials
			.patch('/portal/subdomain', payload)
			.then((res) => {
				if (errors.Subdomain) {
					setErrors({ ...errors, Subdomain: '' });
				}
				setMessage({
					open: true,
					message: "Your portal's domain has been updated.",
					color: 'success',
					displayDuration: 3000,
				});
				var reduxPayload = {
					ID: payload.ID,
					Field: 'Subdomain',
					Value: payload.Subdomain,
				};
				dispatch(update(reduxPayload));

				window.location.href = '/portal/' + res.data + '/settings';
			})
			.catch((err) => {
				if (err.response.data.code === 'SUBDOMAIN_IN_USE') {
					setErrors({
						...errors,
						Subdomain: 'Domain already in use.',
					});
				} else {
					setMessage({
						open: true,
						message: 'Internal server error.',
						color: 'danger',
						displayDuration: 3000,
					});
				}
			})
			.finally(() => setIsSubdomainLoading(false));
	};

	const onImgCrop = (img) => {
		const formData = new FormData();
		formData.append('file', img);
		formData.append('PortalID', settings.ID);
		axiosWithAdminCredentials
			.patch('/portal/avatar', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res) => {
				setImageCrop({ open: false, image: '' });
				setMessage({
					open: true,
					message: "Your portal's avatar has been updated.",
					color: 'success',
					displayDuration: 3000,
				});
				setSettings({ ...settings, Avatar: res.data });
				var reduxPayload = {
					ID: settings.ID,
					Field: 'Avatar',
					Value: res.data,
				};
				dispatch(update(reduxPayload));
			})
			.catch((err) => {
				setMessage({
					open: true,
					message: 'Internal server error.',
					color: 'danger',
					displayDuration: 3000,
				});
			});
	};

	useEffect(() => {
		if (!portal) {
			var payload = {
				id: domain,
			};
			axiosWithAdminCredentials
				.get('/portal/settings', { params: payload })
				.then((res) => {
					dispatch(select({ ID: res.data.ID }));
					setSettings({
						ID: res.data.ID,
						Name: res.data.Name,
						Subdomain: res.data.Subdomain,
						Avatar: res.data.Avatar,
					});
				})
				.catch((err) => {
					navigate('/');
				});
		}
	}, []);

	return (
		<PageBuilder2 portalView>
			<DeleteConfirmationModal
				open={deleteConfirmation}
				onClose={() => setDeleteConfirmation(false)}
				onConfirm={handleDelete}
				label='Are you sure you want to delete this portal? This action is not reversible.'
				deleteLabel='Delete'
			/>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				autoHideDuration={message.displayDuration}
				color={message.color}
				variant='solid'
				open={message.open}
				onClose={() => setMessage({ ...message, open: false })}
			>
				{message.message}
			</Snackbar>
			<ImageCropper
				size='small'
				visible={imageCrop.open}
				image={imageCrop.image}
				onClose={() => setImageCrop({ open: false, image: '' })}
				onChange={onImgCrop}
			/>
			<Stack
				direction='column'
				spacing={4}
				className='mx-auto'
				sx={{
					maxWidth: 800,
				}}
			>
				<Typography level='h1'>Settings</Typography>
				<Divider />
				<Card>
					<Typography level='title-lg'>
						<Skeleton
							loading={
								settings.Name == null ||
								settings.Name == undefined
							}
						>
							Portal Name
						</Skeleton>
					</Typography>
					<Typography level='body-sm'>
						<Skeleton
							loading={
								settings.Name == null ||
								settings.Name == undefined
							}
						>
							This is your portal's visible name within
							FamilyLynk. For example, the name of your company or
							home.
						</Skeleton>
					</Typography>
					{settings.Name != null && settings.Name != undefined && (
						<Input
							size='sm'
							sx={(theme) => ({
								'--Input-focusedInset': 'var(--any, )',
								'--Input-focusedThickness': '0.05rem',
								'--Input-focusedHighlight':
									theme.palette.mode === 'light'
										? 'rgba(0,0,0,1) !important'
										: 'rgba(255,255,255,1) !important',
								'&::before': {
									transition: 'box-shadow .15s ease-in-out',
								},
								'&:focus-within': {
									borderColor: '#000',
								},
							})}
							value={settings.Name}
							onChange={(e) =>
								setSettings({
									...settings,
									Name: e.target.value,
								})
							}
							placeholder='Portal Name'
							slotProps={{
								input: {
									maxLength: 64,
								},
							}}
						/>
					)}
					<Divider />
					<CardActions
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Typography level='body-sm'>
							<Skeleton
								loading={
									settings.Subdomain === null ||
									settings.Subdomain === undefined
								}
							>
								Please use 64 characters at the most.
							</Skeleton>
						</Typography>
						{settings.Name != null &&
							settings.Name != undefined && (
								<Button
									loading={isNameLoading}
									color={
										isNameLoading ? 'primary' : 'neutral'
									}
									variant='outlined'
									disabled={settings.Name.length <= 0}
									onClick={() => updateName()}
								>
									Save
								</Button>
							)}
					</CardActions>
				</Card>
				<Card>
					<Typography level='title-lg'>
						<Skeleton
							loading={
								settings.Subdomain == null ||
								settings.Subdomain == undefined
							}
						>
							Portal URL
						</Skeleton>
					</Typography>
					<Typography level='body-sm'>
						<Skeleton
							loading={
								settings.Subdomain === null ||
								settings.Subdomain === undefined
							}
						>
							This is your portal's URL namespace on FamilyLynk.
							Within it, your team can access the portal.
						</Skeleton>
					</Typography>
					{settings.Subdomain != null &&
						settings.Subdomain != undefined && (
							<Input
								sx={(theme) => ({
									'--Input-focusedInset': 'var(--any, )',
									'--Input-focusedThickness': '0.05rem',
									'--Input-focusedHighlight':
										theme.palette.mode === 'light'
											? 'rgba(0,0,0,1) !important'
											: 'rgba(255,255,255,1) !important',
									'&::before': {
										transition:
											'box-shadow .15s ease-in-out',
									},
									'&:focus-within': {
										borderColor: '#000',
									},
								})}
								startDecorator={'https://'}
								endDecorator={'.familylynk.com'}
								size='sm'
								value={settings.Subdomain}
								slotProps={{
									input: {
										maxLength: 45,
									},
								}}
								onChange={(e) =>
									transformDomainStr(e.target.value)
								}
								placeholder='portal-name'
							/>
						)}
					{errors.Subdomain && (
						<Typography
							color='danger'
							level='body-sm'
						>
							{errors.Subdomain}
						</Typography>
					)}
					<Divider />
					<CardActions
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Typography level='body-sm'>
							<Skeleton
								loading={
									settings.Subdomain === undefined ||
									settings.Subdomain === null
								}
							>
								Please use 45 characters at the most.
							</Skeleton>
						</Typography>
						{settings.Subdomain !== undefined &&
							settings.Subdomain !== null && (
								<Button
									loading={isSubdomainLoading}
									color={
										isSubdomainLoading
											? 'primary'
											: 'neutral'
									}
									variant='outlined'
									onClick={() => updateSubdomain()}
									disabled={settings.Subdomain.length <= 0}
								>
									Save
								</Button>
							)}
					</CardActions>
				</Card>
				<Card>
					<Stack
						direction={'row'}
						spacing={2}
						sx={{ justifyContent: 'space-between' }}
					>
						<Box>
							<Typography
								level='title-lg'
								sx={{ marginBottom: 1 }}
							>
								Portal Avatar
							</Typography>
							<Typography level='body-sm'>
								This is your team's avatar.
								<br /> Click on the avatar to upload a custom
								one from your files.
							</Typography>
						</Box>
						<Avatar
							className='hover:cursor-pointer'
							size='lg'
							sx={{ width: 80, height: 80 }}
							src={settings.Avatar}
							onClick={() => {
								avatarFileInput.current.click();
							}}
						/>
						<input
							type='file'
							accept='image/png, image/jpeg'
							className='hidden'
							ref={avatarFileInput}
							onChange={onImageSelect}
						/>
					</Stack>
					<Divider />
					<CardActions
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Typography level='body-sm'>
							Avatars are only viewed internally.
						</Typography>
					</CardActions>
				</Card>
				<Card>
					<Typography level='title-lg'>Delete Portal</Typography>
					<Typography level='body-sm'>
						Permanently remove your Portal and all of its contents
						from the FamilyLynk platform. This action is not
						reversible — please continue with caution.
					</Typography>
					<Button
						size='sm'
						sx={{ width: 120 }}
						color='danger'
						onClick={() => setDeleteConfirmation(true)}
					>
						Delete Portal
					</Button>
				</Card>
			</Stack>
		</PageBuilder2>
	);
}
