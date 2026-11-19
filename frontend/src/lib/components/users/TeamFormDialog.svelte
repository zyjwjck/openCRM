<script>
  import { X } from '@lucide/svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import EditableMultiSelect from '$lib/components/ui/editable-field/EditableMultiSelect.svelte';
  import { useI18n } from '$lib/utils/i18n.svelte.js';

  const { t } = useI18n();

  /**
   * @typedef {Object} User
   * @property {string} id
   * @property {string} name
   * @property {string} email
   */

  /**
   * @typedef {Object} Team
   * @property {string} [id]
   * @property {string} name
   * @property {string} [description]
   * @property {string[]} [userIds]
   */

  /**
   * @type {{
   *   open?: boolean,
   *   team?: Team | null,
   *   users?: User[],
   *   onClose?: () => void,
   *   onSubmit?: (data: { name: string, description: string, users: string[], teamId?: string }) => void,
   *   isLoading?: boolean
   * }}
   */
  let {
    open = $bindable(false),
    team = null,
    users = [],
    onClose,
    onSubmit,
    isLoading = false
  } = $props();

  // Form state
  let formName = $state('');
  let formDescription = $state('');
  let formUsers = $state(/** @type {string[]} */ ([]));

  // Reset form when dialog opens/closes or team changes
  $effect(() => {
    if (open) {
      formName = team?.name || '';
      formDescription = team?.description || '';
      formUsers = team?.userIds || [];
    }
  });

  const isEditing = $derived(!!team?.id);
  const titleKey = $derived(isEditing ? 'editTeam' : 'createTeamTitle');
  const descriptionKey = $derived(isEditing ? 'editTeamDescription' : 'createTeamDescription');
  const submitKey = $derived(isEditing ? 'saveChanges' : 'createTeamTitle');

  // Transform users for multi-select
  const userOptions = $derived(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email
    }))
  );

  function handleClose() {
    open = false;
    onClose?.();
  }

  /**
   * @param {Event} e
   */
  function handleSubmit(e) {
    e.preventDefault();
    if (!formName.trim()) return;

    onSubmit?.({
      name: formName.trim(),
      description: formDescription.trim(),
      users: formUsers,
      teamId: team?.id
    });
  }

  /**
   * @param {string[]} value
   */
  function handleUsersChange(value) {
    formUsers = value;
  }
</script>

<Dialog.Root bind:open onOpenChange={(o) => !o && handleClose()}>
  <Dialog.Content class="sm:max-w-[500px]" portalProps={{}}>
    <Dialog.Header class="">
      <Dialog.Title class="">{t(titleKey)}</Dialog.Title>
      <Dialog.Description class="">{t(descriptionKey)}</Dialog.Description>
    </Dialog.Header>

    <form onsubmit={handleSubmit} class="space-y-4">
      <div class="space-y-2">
        <Label class="" for="team-name">{t('teamName')} *</Label>
        <Input
          id="team-name"
          bind:value={formName}
          placeholder={t('teamNamePlaceholder')}
          required
          disabled={isLoading}
        />
      </div>

      <div class="space-y-2">
        <Label class="" for="team-description">{t('teamDescription')}</Label>
        <textarea
          id="team-description"
          bind:value={formDescription}
          placeholder={t('teamDescriptionPlaceholder')}
          rows="3"
          disabled={isLoading}
          class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        ></textarea>
      </div>

      <div class="space-y-2">
        <Label class="">{t('assignMembers')}</Label>
        <EditableMultiSelect
          value={formUsers}
          options={userOptions}
          placeholder={t('selectTeamMembers')}
          emptyText={t('noMembersAssigned')}
          onchange={handleUsersChange}
          disabled={isLoading}
          class="rounded-md border p-1"
        />
        <p class="text-muted-foreground text-xs">
          {t('teamMembersAccessHint')}
        </p>
      </div>

      <Dialog.Footer class="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onclick={handleClose} disabled={isLoading}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={isLoading || !formName.trim()}>
          {isLoading ? t('saving') : t(submitKey)}
        </Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
