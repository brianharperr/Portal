import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Divider,
	Dropdown,
	Grid,
	IconButton,
	Input,
	List,
	ListItem,
	ListItemContent,
	ListItemDecorator,
	Menu,
	MenuButton,
	MenuItem,
	Option,
	Select,
	Snackbar,
	Stack,
	Tab,
	TabList,
	TabPanel,
	Tabs,
	Typography,
	tabClasses,
} from '@mui/joy';
import PageBuilder2 from '../../components/admin/PageBuilder2';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedPortal } from '../../redux/features/admin.portal.slice';
import { useEffect, useState } from 'react';
import { axiosWithAdminCredentials } from '../../configs/axios';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import { AddCircleOutlineOutlined, MoreVert, Send } from '@mui/icons-material';
import { formatDate } from '../../utils/strings';

export default function Users() {
	const selectedPortal = useSelector(getSelectedPortal);
	const [deleteConfirmation, setDeleteConfirmation] = useState(null);
	const [users, setUsers] = useState(null);
	const [roles, setRoles] = useState([]);
	const [invitations, setInvitations] = useState(null);
	const [invites, setInvites] = useState([{ email: '', role: '' }]);
	const dispatch = useDispatch();
	const [message, setMessage] = useState({
		open: false,
		message: '',
		title: '',
		color: 'neutral',
		displayDuration: 5000,
		anchorOrigin: { vertical: 'top', horizontal: 'right' },
		id: null,
	});

	const handleInvitationDelete = (id) => {
		axiosWithAdminCredentials
			.delete('/user/invitation', { params: { id: id } })
			.then(() => {
				setInvitations(
					invitations.filter((invitation) => invitation.ID !== id)
				);
				setMessage({
					open: true,
					message: 'Invitation deleted.',
					title: 'Success',
					color: 'success',
					displayDuration: 5000,
					anchorOrigin: { vertical: 'top', horizontal: 'right' },
					id: null,
				});
			});
	};
	const handleDelete = () => {
		axiosWithAdminCredentials
			.delete('/user', { params: { id: deleteConfirmation } })
			.then(() => {
				setUsers(
					users.filter((user) => user.ID !== deleteConfirmation)
				);
				setDeleteConfirmation(null);
				setMessage({
					open: true,
					message: 'User deleted.',
					title: 'Success',
					color: 'success',
					displayDuration: 5000,
					anchorOrigin: { vertical: 'top', horizontal: 'right' },
					id: null,
				});
			});
	};

	const hasNonNullInviteEmail = () => {
		return invites.some((invite) => {
			if (invite.email !== '') {
				return true;
			}
		});
	};

	const handleInvitationCreate = () => {
		var payload = {
			PortalID: selectedPortal.ID,
			Invites: invites,
		};
		axiosWithAdminCredentials
			.post('/email/portal-invite', payload)
			.then((res) => {
				axiosWithAdminCredentials
					.get('/user/invitations', {
						params: payload,
					})
					.then((res) => {
						setInvitations(res.data);
					});
				setMessage({
					open: true,
					message: 'Invitations have been sent.',
					title: 'Success',
					color: 'success',
					displayDuration: 5000,
					anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
					id: null,
				});
			})
			.catch((e) => {
				if (e.response.data.code === 'INV_EMAIL_LIST') {
					setMessage({
						open: true,
						message: 'No valid invites were provided.',
						title: 'Error',
						color: 'danger',
						displayDuration: 5000,
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'right',
						},
						id: null,
					});
				} else {
					setMessage({
						open: true,
						message: 'Internal server error.',
						title: 'Error',
						color: 'danger',
						displayDuration: 5000,
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'right',
						},
						id: null,
					});
				}
			});
	};

	useEffect(() => {
		if (selectedPortal) {
			const payload = {
				id: selectedPortal.ID,
			};
			axiosWithAdminCredentials
				.get('/user/portal/admin', {
					params: payload,
				})
				.then((res) => {
					setUsers(res.data);
				});

			axiosWithAdminCredentials
				.get('/role/admin', { params: { id: selectedPortal.ID } })
				.then((res) => {
					setRoles(res.data);
				});

			axiosWithAdminCredentials
				.get('/user/invitations', {
					params: payload,
				})
				.then((res) => {
					setInvitations(res.data);
				});
		}
	}, [selectedPortal]);

	return (
		<PageBuilder2 portalView>
			<DeleteConfirmationModal
				open={deleteConfirmation != null}
				onClose={() => setDeleteConfirmation(null)}
				onConfirm={handleDelete}
				label='Are you sure you want to remove this user?'
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
			<Stack
				direction='column'
				spacing={1}
				className='mx-auto'
				sx={{
					maxWidth: 800,
				}}
			>
				<Box sx={{ py: 4 }}>
					<Typography level='h2'>Users</Typography>
					<Typography level='body-sm'>
						Manage portal members and invitations
					</Typography>
				</Box>
				<Card>
					<CardContent>
						<Typography
							sx={{ py: 3 }}
							level='body-sm'
						>
							Invite new users by email.
						</Typography>
						<Divider />
						<br />
						<Grid
							container
							spacing={2}
						>
							<Grid xs={6}>
								<Typography level='title-sm'>Email</Typography>
							</Grid>
							<Grid xs={6}>
								<Typography level='title-sm'>Role</Typography>
							</Grid>
							{invites.map((invite, index) => {
								return (
									<>
										<Grid xs={6}>
											<Input
												size='sm'
												value={invite.email}
												onChange={(e) => {
													const newInvites = [
														...invites,
													];
													newInvites[index].email =
														e.target.value;
													setInvites(newInvites);
												}}
												placeholder='Email'
											/>
										</Grid>
										<Grid xs={6}>
											<Select
												size='sm'
												value={invite.role}
												onChange={(e, data) => {
													const newInvites = [
														...invites,
													];
													newInvites[index].role =
														data;
													setInvites(newInvites);
												}}
												placeholder='Role'
											>
												{roles?.map((role) => {
													return (
														<Option
															key={role.ID}
															value={role.ID}
														>
															{role.Name}
														</Option>
													);
												})}
											</Select>
										</Grid>
									</>
								);
							})}
						</Grid>
					</CardContent>
					<CardActions
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
						}}
					>
						<Button
							size='sm'
							startDecorator={<AddCircleOutlineOutlined />}
							sx={{ maxWidth: '150px' }}
							color='neutral'
							variant='outlined'
							onClick={() => {
								const newInvites = [...invites];
								var defaultIdx = roles.findIndex(
									(x) => x.Default === 1 && x.PortalID != null
								);
								if (defaultIdx === -1) {
									defaultIdx = 0;
								}
								newInvites.push({
									email: '',
									role: roles[defaultIdx].ID,
								});
								setInvites(newInvites);
							}}
						>
							Add more
						</Button>
						{console.log(hasNonNullInviteEmail())}
						<Button
							size='sm'
							startDecorator={<Send />}
							onClick={handleInvitationCreate}
							disabled={hasNonNullInviteEmail() === false}
						>
							Send
						</Button>
					</CardActions>
				</Card>
				<br />
				<Tabs
					size='sm'
					className='!bg-[rgba(0,0,0,0)]'
					defaultValue={0}
				>
					<TabList
						sx={{
							pt: 1,
							[`&& .${tabClasses.root}`]: {
								flex: 'initial',
								bgcolor: 'transparent',
								'&:hover': {
									bgcolor: 'transparent',
								},
								[`&.${tabClasses.selected}`]: {
									color: 'primary.plainColor',
									'&::after': {
										height: 2,
										borderTopLeftRadius: 3,
										borderTopRightRadius: 3,
										bgcolor: 'primary.500',
									},
								},
							},
						}}
					>
						<Tab>Users</Tab>
						<Tab>Pending Invitations</Tab>
					</TabList>
					<TabPanel value={0}>
						<List sx={{ gap: 1 }}>
							{users && users.length > 0 ? (
								<>
									{users.map((user) => {
										return (
											<ListItem
												className='!rounded-md'
												sx={(theme) => ({
													py: 2,
													backgroundColor:
														!user.Activated &&
														theme.palette.danger[
															theme.palette
																.mode ===
															'light'
																? 100
																: 900
														],
												})}
											>
												<ListItemDecorator>
													<Avatar
														variant='outlined'
														src={user.Pic}
													/>
												</ListItemDecorator>
												<ListItemContent
													sx={{
														ml: 2,
														display: 'flex',
														justifyContent:
															'space-between',
														alignItems: 'center',
													}}
												>
													<Stack>
														<Typography level='title-sm'>{`${user.FirstName} ${user.LastName}`}</Typography>
														<Typography
															level='body-sm'
															noWrap
														>
															{user.Email}
														</Typography>
													</Stack>
													<Stack
														direction='row'
														sx={{
															display: 'flex',
															alignItems:
																'center',
														}}
													>
														<Typography
															level='body-sm'
															sx={{ mr: 1 }}
														>
															{user.Role.Name}
														</Typography>
														{user.Role.ID === 1 && (
															<Dropdown>
																<MenuButton
																	slots={{
																		root: IconButton,
																	}}
																	slotProps={{
																		root: {
																			variant:
																				'neutral',
																			color: 'neutral',
																		},
																	}}
																>
																	<MoreVert />
																</MenuButton>
																<Menu size='sm'>
																	<MenuItem>
																		{user.Activated
																			? 'Deactivate'
																			: 'Activate'}
																	</MenuItem>
																	<MenuItem
																		color='danger'
																		onClick={() =>
																			setDeleteConfirmation(
																				user.ID
																			)
																		}
																	>
																		Delete
																	</MenuItem>
																</Menu>
															</Dropdown>
														)}
													</Stack>
												</ListItemContent>
											</ListItem>
										);
									})}
								</>
							) : (
								'No users'
							)}
						</List>
					</TabPanel>
					<TabPanel value={1}>
						<List sx={{ gap: 1 }}>
							{invitations && invitations.length > 0 ? (
								<>
									{invitations.map((user) => {
										return (
											<ListItem
												sx={{
													py: 2,
												}}
											>
												<ListItemContent
													sx={{
														ml: 2,
														display: 'flex',
														justifyContent:
															'space-between',
														alignItems: 'center',
													}}
												>
													<Stack>
														<Typography level='title-sm'>
															{user.Email}
														</Typography>
														<Typography level='body-sm'>
															Sent{' '}
															{formatDate(
																user.DateCreated
															)}
														</Typography>
													</Stack>
													<Stack
														direction='row'
														sx={{
															display: 'flex',
															alignItems:
																'center',
														}}
													>
														<Typography
															level='body-sm'
															sx={{ mr: 1 }}
														>
															{
																roles?.find(
																	(x) =>
																		x.ID ===
																		user.RoleID
																)?.Name
															}
														</Typography>
														<Dropdown>
															<MenuButton
																slots={{
																	root: IconButton,
																}}
																slotProps={{
																	root: {
																		variant:
																			'neutral',
																		color: 'neutral',
																	},
																}}
															>
																<MoreVert />
															</MenuButton>
															<Menu size='sm'>
																<MenuItem
																	onClick={() =>
																		null
																	}
																>
																	Resend
																</MenuItem>
																<MenuItem
																	color='danger'
																	onClick={() =>
																		handleInvitationDelete(
																			user.ID
																		)
																	}
																>
																	Delete
																</MenuItem>
															</Menu>
														</Dropdown>
													</Stack>
												</ListItemContent>
											</ListItem>
										);
									})}
								</>
							) : (
								'No pending invitations.'
							)}
						</List>
					</TabPanel>
				</Tabs>
			</Stack>
		</PageBuilder2>
	);
}
