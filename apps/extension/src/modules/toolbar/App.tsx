import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@common/components';
import { useSiteEnabled } from '@common/hooks/useSiteEnabled';
import { SITE_CHANGED, SITE_PING, getHostname } from '@common/utils/siteAccess';

const pingContentScript = async (tabId: number | undefined) => {
  if (tabId === undefined || !chrome.tabs?.sendMessage) return false;
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: SITE_PING,
    });
    return response?.ok === true;
  } catch {
    return false;
  }
};

const notifyContentScript = (tabId: number | undefined) => {
  if (tabId === undefined || !chrome.tabs?.sendMessage) return;
  try {
    void chrome.tabs.sendMessage(tabId, { type: SITE_CHANGED }).catch(() => {});
  } catch {
    /* content script absent; storage event is the fallback */
  }
};

export const App = () => {
  const { t } = useTranslation();
  const [hostname, setHostname] = useState<string | null>(null);
  const [tabId, setTabId] = useState<number | undefined>(undefined);
  const [tabResolved, setTabResolved] = useState(false);
  const [scriptAlive, setScriptAlive] = useState(false);
  const { enabled, isReady, setEnabled } = useSiteEnabled(hostname);

  useEffect(() => {
    let active = true;
    const resolveTab = async () => {
      try {
        const tabs = await chrome.tabs?.query({
          active: true,
          currentWindow: true,
        });
        if (!active) return;
        const tab = tabs?.[0];
        setHostname(getHostname(tab?.url));
        setTabId(tab?.id);
        setScriptAlive(await pingContentScript(tab?.id));
      } catch {
        if (!active) return;
        setHostname(null);
        setScriptAlive(false);
      } finally {
        if (active) setTabResolved(true);
      }
    };
    void resolveTab();
    return () => {
      active = false;
    };
  }, []);

  const loaded = tabResolved && isReady;

  const handleToggle = (next: boolean) => {
    void setEnabled(next).then(() => notifyContentScript(tabId));
  };

  return (
    <div className="tai:flex tai:flex-col tai:gap-3 tai:p-4">
      <h1 className="tai:text-medium tai:font-semibold tai:text-txt2">
        {t('toolbar.title')}
      </h1>
      {loaded && hostname ? (
        <>
          <p className="tai:text-small tai:text-txt3">
            {t('toolbar.currentSite')}: <span>{hostname}</span>
          </p>
          <div className="tai:flex tai:items-center tai:justify-between">
            <span className="tai:text-medium tai:font-semibold tai:text-txt1">
              {enabled ? t('toolbar.disable') : t('toolbar.enable')}
            </span>
            <Switch
              checked={enabled}
              onCheckedChange={handleToggle}
              label={hostname}
            />
          </div>
          <p className="tai:text-small tai:text-txt3">
            {enabled ? t('toolbar.enabled') : t('toolbar.disabled')}
          </p>
          {!scriptAlive && (
            <p className="tai:text-small tai:text-txt3">
              {t('toolbar.reloadHint')}
            </p>
          )}
        </>
      ) : (
        <p className="tai:text-small tai:text-txt3">
          {loaded ? t('toolbar.unsupported') : '…'}
        </p>
      )}
    </div>
  );
};
