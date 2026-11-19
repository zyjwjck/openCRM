<script>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import EditableMultiSelect from '$lib/components/ui/editable-field/EditableMultiSelect.svelte';
  import { t } from '$lib/utils/i18n.svelte.js';

  /**
   * @typedef {Object} UserEditData
   * @property {string} [userId]
   * @property {string} [profileId]
   * @property {string} [username]
   * @property {string} [email]
   * @property {string} [role]
   * @property {string[]} [teamIds]
   * @property {boolean} [isActive]
   * @property {string} [password]
   */

  /**
   * @type {{
   *   open?: boolean,
   *   user?: any,
   *   teams?: Array<{ id: string, name: string }>,
   *   isAdmin?: boolean,
   *   onClose?: () => void,
   *   onSubmit?: (data: UserEditData) => Promise<void>
   * }}
   */
  let {
    open = $bindable(false),
    user = null,
    teams = [],
    isAdmin = false,
    onClose,
    onSubmit
  } = $props();

  let formUsername = $state('');
  let formEmail = $state('');
  let formRole = $state('USER');
  let formTeamIds = $state(/** @type {string[]} */ ([]));
  let formIsActive = $state(true);
  let formPassword = $state('');
  let formConfirmPassword = $state('');
  let passwordError = $state('');
  let submitting = $state(false);

  // Reset form when dialog opens
  $effect(() => {
    if (open && user) {
      formUsername = user.username || '';
      formEmail = user.email || '';
      formRole = user.role || 'USER';
      formTeamIds = user.teamIds || [];
      formIsActive = user.isActive !== false;
      formPassword = '';
      formConfirmPassword = '';
      passwordError = '';
    }
  });

  const teamOptions = $derived(
    (teams || []).map((tm) => ({ id: tm.id, name: tm.name }))
  );

  function handleClose() {
    open = false;
    onClose?.();
  }

  /**
   * @param {string[]} value
   */
  function handleTeamsChange(value) {
    formTeamIds = value;
  }

  async function handleSubmit() {
    if (!onSubmit || submitting) return;
    if (isAdmin && formPassword) {
      if (formPassword !== formConfirmPassword) {
        passwordError = t('passwordsDoNotMatch');
        return;
      }
      if (formPassword.length < 8) {
        passwordError = t('passwordTooShort');
        return;
      }
    }
    passwordError = '';
    submitting = true;
    try {
      await onSubmit({
        userId: user?.id,
        profileId: user?.profileId,
        username: formUsername,
        email: formEmail,
        role: formRole,
        teamIds: formTeamIds,
        isActive: formIsActive,
        password: formPassword
      });
      handleClose();
    } catch (err) {
      // Surface the error via console; parent may also toast
      console.error('User edit failed:', err);
    } finally {
      submitting = false;
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={(o) => !o && handleClose()}>
  <Dialog.Content class="sm:max-w-[800px]">
    <Dialog.Header>
      <Dialog.Title>{t('editUser')}</Dialog.Title>
      <Dialog.Description>{t('editUserDescription')}</Dialog.Description>
    </Dialog.Header>

    <div class="grid grid-cols-2 gap-4 space-y-4">
      <div class="space-y-2">
        <Label for="edit-username">{t('username')}</Label>
        <Input id="edit-username" bind:value={formUsername} placeholder={t('username')} />
      </div>

      <div class="space-y-2">
        <Label for="edit-email">{t('email')} *</Label>
        <Input id="edit-email" bind:value={formEmail} type="email" required />
      </div>

      <div class="space-y-2">
        <Label for="edit-role">{t('role')}</Label>
        <select
          id="edit-role"
          bind:value={formRole}
          class="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <option value="USER">{t('user')}</option>
          <option value="ADMIN">{t('admin')}</option>
        </select>
      </div>

      <div class="space-y-2">
        <Label for="edit-status">{t('status')}</Label>
        <select
          id="edit-status"
          bind:value={formIsActive}
          class="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <option value={true}>{t('active')}</option>
          <option value={false}>{t('inactive')}</option>
        </select>
      </div>

      <div class="space-y-2">
        <Label>{t('teams')}</Label>
        <EditableMultiSelect
          value={formTeamIds}
          options={teamOptions}
          placeholder={t('selectTeams')}
          emptyText={t('noTeamsAssigned')}
          onchange={handleTeamsChange}
          class="rounded-md border p-1"
        />
      </div>

      {#if isAdmin}
        <div class="col-span-2 space-y-3 rounded-md border border-dashed p-3">
          <p class="text-sm font-medium">{t('changePassword')}</p>
          <p class="text-muted-foreground text-xs">{t('leavePasswordBlank')}</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="edit-password">{t('newPassword')}</Label>
              <Input
                id="edit-password"
                bind:value={formPassword}
                type="password"
                autocomplete="new-password"
                placeholder={t('newPassword')}
              />
            </div>
            <div class="space-y-2">
              <Label for="edit-confirm-password">{t('confirmPassword')}</Label>
              <Input
                id="edit-confirm-password"
                bind:value={formConfirmPassword}
                type="password"
                autocomplete="new-password"
                placeholder={t('confirmPassword')}
              />
            </div>
          </div>
          {#if passwordError}
            <p class="text-destructive text-sm">{passwordError}</p>
          {/if}
        </div>
      {/if}

      <Dialog.Footer class="col-span-2 gap-2 sm:gap-0">
        <Button type="button" variant="outline" onclick={handleClose} disabled={submitting}>
          {t('cancel')}
        </Button>
        <Button type="button" onclick={handleSubmit} disabled={submitting || !formEmail.trim()}>
          {submitting ? t('saving') : t('save')}
        </Button>
      </Dialog.Footer>
    </div>
  </Dialog.Content>
</Dialog.Root>
