'use client';

import { useState, useEffect } from 'react';

function useIsIntersecting (targetRef, rootMargin = '500px', threshold = .001, loading) {

  const [isIntersecting, setIsIntersecting] = useState();

  useEffect(() => {

    const observable = targetRef.current;
    if (!observable) return;

    // BEGIN INTERSECTION OBSERVER
    let intersectionCallback = (entries, observer) => { 
      entries.forEach(entry => {

        // Each entry describes an intersection change for one observed
        // target element:
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time
        //console.log('entry.isIntersecting', entry.isIntersecting);
        if (entry.isIntersecting && (typeof(isIntersecting) === 'undefined' || isIntersecting===false)) {
          setIsIntersecting(true);
          // let section = entry.target; // entry.target.parentNode;
        } else if (!entry.isIntersecting && isIntersecting!==false) {
          setIsIntersecting(false);
          // console.log('setIsIntersecting(false)', targetRef.current);
        }
        
      });
    };

    let options = { 
      root: null, // null = browser viewport; otherwise, use... document.querySelector('#scrollArea') // Must be an ancestor of the target
      rootMargin: rootMargin,
      threshold: threshold,
    }

    let observer = new IntersectionObserver(intersectionCallback, options);
    observer.observe(observable); 
    // END INTERSECTION OBSERVER

    return () => {
      try {
        observer.unobserve(observable);
      } catch (e) {
        // ignore if already disconnected
      }
      observer.disconnect();
    };

  }, [targetRef, isIntersecting, rootMargin, threshold, loading]);

  return isIntersecting;
}

export default useIsIntersecting;
