import React from 'react';
import styles from './CreateEventModal.module.scss';

type ColorSectionProps = {
  selected: string,
  setValue: ((value: string) => void),
};

const ColorSection = (props: ColorSectionProps): JSX.Element => {
  const { selected, setValue } = props;

  return (
    <div className={styles['color-selection']}>
      <button
        type="button"
        className={[selected === 'green' ? styles.selected : null, 'green-background', styles['color-button']].join(' ')}
        aria-label="Color Green"
        onClick={() => setValue('green')}
      />
      <button
        type="button"
        className={[
          selected === 'lightgreen' ? styles.selected : null,
          'lightgreen-background',
          styles['color-button'],
        ].join(' ')}
        aria-label="Color Lightgreen"
        onClick={() => setValue('lightgreen')}
      />
      <button
        type="button"
        id="blue"
        className={[selected === 'blue' ? styles.selected : null, 'blue-background', styles['color-button']].join(' ')}
        aria-label="Color Blue"
        onClick={() => setValue('blue')}
      />
      <button
        type="button"
        id="purple"
        className={[selected === 'purple' ? styles.selected : null, 'purple-background', styles['color-button']].join(' ')}
        aria-label="Color Purple"
        onClick={() => setValue('purple')}
      />
      <button
        type="button"
        id="yellow"
        className={[selected === 'yellow' ? styles.selected : null, 'yellow-background', styles['color-button']].join(' ')}
        aria-label="Color Yellow"
        onClick={() => setValue('yellow')}
      />
      <button
        type="button"
        id="orange"
        className={[selected === 'orange' ? styles.selected : null, 'orange-background', styles['color-button']].join(' ')}
        aria-label="Color Orange"
        onClick={() => setValue('orange')}
      />
      <button
        type="button"
        id="red"
        className={[selected === 'red' ? styles.selected : null, 'red-background', styles['color-button']].join(' ')}
        aria-label="Color Red"
        onClick={() => setValue('red')}
      />
    </div>
  );
};

export default ColorSection;
