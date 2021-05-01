import classNames from "classnames";
import React from "react";
import snd_boughtUpgrade from "../../../resources/audio/ui/bought_upgrade.flac";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundInstance } from "../../core/sound/SoundInstance";
import { ReactEntity } from "../menu/ReactEntity";
import { getUpgradeManager, UpgradeManager } from "./UpgradeManager";
import { getUpgrade, UpgradeId } from "./upgrades";
import "./UpgradeShop.css";

// TODO: Gamepad support
export class UpgradeShop extends BaseEntity implements Entity {
  id = "upgradeShop";
  reactView: ReactEntity<unknown>;

  constructor() {
    super();

    this.reactView = this.addChild(
      new ReactEntity(() => <UpgradeShopView {...this.getProps()} />)
    );
  }

  getProps(): Props {
    const upgradeManager = getUpgradeManager(this.game!);
    return {
      money: upgradeManager.money,
      availableUpgrades: upgradeManager.getAvailableUpgrades(),
      purchasedUpgrades: upgradeManager.getPurchasedUpgrades(),
      upgradeManager,
      buyUpgrade: (upgradeId: UpgradeId) =>
        upgradeManager.buyUpgrade(upgradeId),
    };
  }

  handlers = {
    diverJumped: () => {
      this.destroy();
    },

    upgradeBought: () => {
      this.reactView.reactRender();

      this.game?.addEntity(new SoundInstance(snd_boughtUpgrade, { gain: 0.2 }));
    },
  };
}

interface Props {
  money: number;
  availableUpgrades: UpgradeId[];
  purchasedUpgrades: UpgradeId[];
  upgradeManager: UpgradeManager;
  buyUpgrade: (upgradeId: UpgradeId) => void;
}

function UpgradeShopView({
  money,
  purchasedUpgrades,
  availableUpgrades,
  upgradeManager,
  buyUpgrade,
}: Props) {
  return (
    <div className="UpgradeShop">
      <div className="Money">${money}</div>
      <h1>Upgrades</h1>
      <div className="UpgradeButtons">
        {availableUpgrades.map((upgradeId) => {
          const upgrade = getUpgrade(upgradeId);
          const affordable = upgradeManager.canAffordUpgrade(upgradeId);
          return (
            <div
              className={classNames("UpgradeButton", { affordable })}
              onClick={() => {
                if (affordable) {
                  buyUpgrade(upgradeId);
                }
              }}
              key={upgradeId}
            >
              <div className="name-and-cost">
                <div className="name">{upgrade.name}</div>
                <div className="cost">${upgrade.cost}</div>
              </div>
              <div className="description">{upgrade.description}</div>
            </div>
          );
        })}
      </div>
      {purchasedUpgrades.length > 0 && (
        <div className="PurchasedUpgrades">
          Purchased:{" "}
          {purchasedUpgrades.map((upgradeId) => (
            <span title={getUpgrade(upgradeId).description} key={upgradeId}>
              {getUpgrade(upgradeId).name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
